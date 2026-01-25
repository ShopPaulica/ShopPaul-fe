import {Component, OnInit} from '@angular/core';
import {ProductsServices} from '../../services/products.services';
import {ProductModel} from '../../shared/interfaces/product.model';
import {FormsModule} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import {CartService} from '../../services/cart.service';
import {NavigationService} from '../../services/router-service';

@Component({
  selector: 'app-products',
  imports: [
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './products.component.html',
  standalone: true,
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  protected products: ProductModel[] = [];
  public search: string = '';

  constructor(private _products: ProductsServices, private cartService: CartService, protected routersService: NavigationService) {}

  ngOnInit(): void {
  this.products = this._products.getProducts()
  }

  public removeFromCart(product: ProductModel): void {
    this.cartService.removeOne(product);
  }

  public addToCart(product: ProductModel): void {
    this.cartService.addOne(product);
  }

  public isInCart(id: number | undefined): number {
    return id ? this.cartService.howManyAreOfOne(id) : 0;
  }

  public goToDetails(id: number | undefined): void {
    this.routersService.goToProduct(id);
  }
}
