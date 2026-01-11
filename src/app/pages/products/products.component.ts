import {Component, OnInit} from '@angular/core';
import {ProductsServices} from '../../services/products.services';
import {ProductModel} from '../../shared/interfaces/product.model';
import {FormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {DecimalPipe} from '@angular/common';

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

  constructor(private _products: ProductsServices) {}

  ngOnInit(): void {
  this.products = this._products.getProducts()
  }

  protected readonly of = of;
}
