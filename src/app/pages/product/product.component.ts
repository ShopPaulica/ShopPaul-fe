import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductsServices} from '../../services/products.services';
import {ProductModel} from '../../shared/interfaces/product.model';

@Component({
  selector: 'app-product',
  imports: [

  ],
  templateUrl: './product.component.html',
  standalone: true,
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  public product!: ProductModel;

  constructor(private route: ActivatedRoute, private products: ProductsServices) {}

  ngOnInit() {
   const id = this.route.snapshot.paramMap.get('id');
   this.product = this.products.getProductAfterId(Number(id))
  }
}
