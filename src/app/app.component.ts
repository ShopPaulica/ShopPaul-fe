import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {ShoppingCartProduct} from './shared/interfaces/shopping-cart-product.model';
import {LocalStorageService} from './services/local-server.service';
import {CartService} from './services/cart.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'paulFE';

  constructor(private localStorage: LocalStorageService, private cartService: CartService) {
  }

  ngOnInit() {
    this.cartService.setCart(this.localStorage.get<ShoppingCartProduct[]>('cart', []));
  }
}
