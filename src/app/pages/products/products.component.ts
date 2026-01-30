import {Component, OnInit} from '@angular/core';
import {ProductsServices} from '../../shared/services/products.services';
import {ProductModel} from '../../shared/interfaces/product.model';
import {FormsModule} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import {CartService} from '../../shared/services/cart.service';
import {NavigationService} from '../../shared/services/router-service';
import {SlideMenuComponent} from '../../components/slide-menu/slide-menu.component';
import {detailsModalComponent} from '../../components/details-modal/details-modal.component';
import {of} from 'rxjs';

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
  public totalPages: number = 0;
  public currentPage = 1;

  constructor(private _products: ProductsServices, private cartService: CartService, protected routersService: NavigationService) {}

  ngOnInit(): void {
    this.products = this._products.getProducts();
    this.totalPages = this._products.getPages();
  }

  get pagesToShow(): number[] {
    const p = this.currentPage;
    const last = this.totalPages;

    if (last <= 3) return Array.from({ length: last }, (_, i) => i + 1);

    // capete
    if (p === 1) return [1, 2, 3];
    if (p === last) return [last - 2, last - 1, last];

    // middle
    return [p - 1, p, p + 1];
  }

  public goToPage(page: number, ev?: Event): void {
    ev?.stopPropagation();
    this.currentPage = page;
    // aici faci fetch / filtrare / ce ai tu
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

  protected readonly of = of;
}
