import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ShoppingCartProduct} from '../../shared/interfaces/shopping-cart-product.model';
import {CartService} from '../../shared/services/cart.service';
import {NavigationService} from '../../shared/services/router-service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports: [
    ReactiveFormsModule,
    DecimalPipe
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

  constructor(private cartService: CartService, private _fb: FormBuilder) {}

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

  public isInCart(id: number | undefined): number {
    return id ? this.cartService.howManyAreOfOne(id) ?? 0 : 0;
  }
}
