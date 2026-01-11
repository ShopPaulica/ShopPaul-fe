import {Component, OnInit} from '@angular/core';
import {ProductsServices} from '../../services/products.services';
import {ProductModel} from '../../shared/interfaces/product.model';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.component.html',
  standalone: true,
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  protected products: ProductModel[] = [];

  constructor(private _products: ProductsServices) {}

  ngOnInit(): void {
  this.products = this._products.getProducts()
  }
}
