import {Component, DestroyRef, Inject, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ShoppingCartProduct} from '../../shared/interfaces/shopping-cart-product.model';
import {CartService} from '../../shared/services/cart.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import {ProductModel} from '../../shared/interfaces/product.model';
import {DATA_PROVIDER_TOKEN} from '../../shared/services/admin/const/data-provider-token';
import {OrdersFacade} from '../../shared/services/admin/orders/facade/orders-facade.service';
import {DataProviderModel} from '../../shared/services/admin/model/data-provider-facade.model';
import {OrderDTO} from '../../shared/services/admin/orders/models/orderDTO';
import {OrderArgs} from '../../shared/services/admin/orders/models/order-filters-model';
import {OrdersState} from '../../shared/services/admin/orders/models/order-state-model';
import {NotificationService} from '../../shared/services/notification.service';
import {NavigationService} from '../../shared/services/router-service';

@Component({
  selector: 'app-order-details',
  imports: [
    ReactiveFormsModule,
    DecimalPipe
  ],
  providers: [
    {
      provide: DATA_PROVIDER_TOKEN,
      useExisting: OrdersFacade,
    }
  ],
  templateUrl: './order-details.component.html',
  standalone: true,
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit{
  public shoppingCart: ShoppingCartProduct[] = []
  private readonly destroyRef = inject(DestroyRef);
  public formDetails!: FormGroup;

  public get getTotal(): number {
    return this.cartService.getTotal;
  }

  constructor(
    private cartService: CartService,
    private _fb: FormBuilder,
    private readonly _ns: NotificationService,
    private router: NavigationService,
    @Inject(DATA_PROVIDER_TOKEN) private dataProvider: DataProviderModel<OrderDTO, OrderArgs, OrdersState>,
  ) {}

  ngOnInit() {
    this.cartService.cart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((products: ShoppingCartProduct[]) => {
      this.shoppingCart = products;
    })

    this.formDetails = this._fb.group({
      name: [null as File | null, [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      vin: ['', [Validators.required]],
      details: ['', [Validators.required]],
    })
  }

  public removeOne(item: ShoppingCartProduct): void {
    this.cartService.removeOne(item)
  }

  public addOne(item: ShoppingCartProduct): void {
    this.cartService.addOne(item)
  }

  public isInCart(id: string | undefined): number {
    return id ? this.cartService.howManyAreOfOne(id) ?? 0 : 0;
  }

  public getBgImage(product: ProductModel): string {
    const img = product?.image;
    if (!img?.base64 || !img?.contentType) return 'none';
    return `url("data:${img.contentType};base64,${img.base64}")`;
  }

  public sendOrder(): void {
    if (this.formDetails.invalid) {
      this.formDetails.markAllAsTouched();

      this._ns.error('Completează toate câmpurile obligatorii.', {
        title: 'Formular invalid',
        durationMs: 4000
      });
      return;
    }

    if (!this.shoppingCart.length) {
      this._ns.error('Coșul este gol.', {
        title: 'Comandă invalidă',
        durationMs: 4000
      });
      return;
    }

    this.dataProvider.saveData({
      ...this.formDetails.getRawValue(),
      description: this.formDetails.getRawValue().details,
      total: this.getTotal,
      items: this.shoppingCart.map((item: ShoppingCartProduct) => ({
        productId: item.id ?? '',
        name: item.name,
        price: item.price,
        qty: item.howMany,
      }))
    } as OrderDTO).subscribe({
      next: () => {
        this._ns.success('Comanda a fost trimisă cu succes.', {
          title: 'Comandă trimisă',
          durationMs: 4000
        });

        this.formDetails.reset();
        this.cartService.cleanCart();
        this.router.goToHome();
      },
      error: (err) => {
        this._ns.error(
          err?.error?.message ?? 'A apărut o eroare la trimiterea comenzii.',
          {
            title: 'Eroare comandă',
            durationMs: 5000
          }
        );
      }
    });
  }
}
