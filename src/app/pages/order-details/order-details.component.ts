import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ShoppingCartProduct} from '../../shared/interfaces/shopping-cart-product.model';
import {CartService} from '../../services/cart.service';
import {NavigationService} from '../../services/router-service';

@Component({
  selector: 'app-order-details',
  imports: [],
  templateUrl: './order-details.component.html',
  standalone: true,
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit{
  public shoppingCart: ShoppingCartProduct[] = []
  private readonly destroyRef = inject(DestroyRef);

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((products: ShoppingCartProduct[]) => {
      this.shoppingCart = products;
    })
  }
}
