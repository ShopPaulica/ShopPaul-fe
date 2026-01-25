import {Component, OnInit} from '@angular/core';
import {ProductsServices} from '../../services/products.services';
import {ProductModel} from '../../shared/interfaces/product.model';
import {FormsModule} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import {CartService} from '../../services/cart.service';
import {NavigationService} from '../../services/router-service';
import {SlideMenuComponent} from '../../components/slide-menu/slide-menu.component';
import {detailsModalComponent} from '../../components/details-modal/details-modal.component';

@Component({
  selector: 'app-products',
  imports: [
    FormsModule,
    DecimalPipe,
    SlideMenuComponent,
    detailsModalComponent
  ],
  templateUrl: './products.component.html',
  standalone: true,
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  protected products: ProductModel[] = [];
  public search: string = '';
  public toggleDetails: boolean = false;
  public selectedItem!: ProductModel;

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

  public goToDetails(product: ProductModel): void {
    this.selectedItem = product;
    this.toggleDetails = true;
  }
}
