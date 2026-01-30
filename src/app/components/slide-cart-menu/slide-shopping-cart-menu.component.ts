import {DecimalPipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, DestroyRef, inject, input, Input, OnInit, output } from '@angular/core';
import {CartService} from '../../shared/services/cart.service';
import {ShoppingCartProduct} from '../../shared/interfaces/shopping-cart-product.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {routes} from '../../app.routes';
import {NavigationService} from '../../shared/services/router-service';

@Component({
  selector: 'app-slide-shopping-cart-menu',
  imports: [NgForOf, NgIf, NgOptimizedImage, DecimalPipe],
  standalone: true,
  templateUrl: './slide-shopping-cart-menu.component.html',
  styleUrl: './slide-shopping-cart-menu.component.scss'
})
export class SlideShoppingCartMenuComponent implements OnInit {
  public position = input<string>('right') ;
  public isOpenChange = output<boolean>();
  private readonly destroyRef = inject(DestroyRef);
  protected router: NavigationService = inject(NavigationService);

  @Input() public set toggleMenu(bool: boolean) {
    this.isOpen = bool;
  }

  public shoppingCart: ShoppingCartProduct[] = []
  public isOpen = false;

  constructor(private cartService: CartService) {}

  public ngOnInit() {
    this.cartService.cart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((products: ShoppingCartProduct[]) => {
      this.shoppingCart = products;
    })
  }

  public get getTotal(): number {
    return this.cartService.getTotal;
  }

  public closeMenu(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false)
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

  public cleanCart(): void {
    this.cartService.cleanCart();
  }

  protected readonly routes = routes;
}
