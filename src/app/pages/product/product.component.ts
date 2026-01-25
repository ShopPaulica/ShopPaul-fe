import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductsServices} from '../../services/products.services';
import {ProductModel} from '../../shared/interfaces/product.model';
import {DecimalPipe} from '@angular/common';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-product',
  imports: [
    DecimalPipe

  ],
  templateUrl: './product.component.html',
  standalone: true,
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  public product!: ProductModel;

  constructor(private route: ActivatedRoute, private cartService: CartService, private products: ProductsServices) {}

  ngOnInit() {
   const id = this.route.snapshot.paramMap.get('id');
   this.product = this.products.getProductAfterId(Number(id))
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
}
