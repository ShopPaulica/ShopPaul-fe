import {Component, OnInit} from '@angular/core';
import {ProductsServices} from '../../shared/services/products.services';
import {ProductModel, ProductsPaginationModel} from '../../shared/interfaces/product.model';
import {FormsModule} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import {CartService} from '../../shared/services/cart.service';
import {NavigationService} from '../../shared/services/router-service';
import {SlideMenuComponent} from '../../components/slide-menu/slide-menu.component';
import {detailsModalComponent} from '../../components/details-modal/details-modal.component';
import {catchError, of, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../../shared/services/notification.service';

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
  public pages: number[] = [];

  constructor(private _products: ProductsServices,private readonly _ns: NotificationService, private cartService: CartService, protected routersService: NavigationService) {}

  ngOnInit(): void {
    //todo move it in a behavior subject
    this._products.getProducts(this.currentPage).subscribe((res: ProductsPaginationModel) => {
      this.products = res.items;
      this.pages = res.pages;
      this.currentPage = res.page;
      this.totalPages = res.totalPages;
    });
  }

  get pagesToShow(): number[] {
    const p = this.currentPage;
    const last = this.totalPages;

    if (last <= 3) return Array.from({ length: last }, (_, i) => i + 1);

    if (p === 1) return [1, 2, 3];
    if (p === last) return [last - 2, last - 1, last];

    return [p - 1, p, p + 1];
  }

  public goToPage(page: number, ev?: Event): void {
    ev?.stopPropagation();
    this.currentPage = page;
  }

  public removeFromCart(product: ProductModel): void {
    this.cartService.removeOne(product);
  }

  public addToCart(product: ProductModel): void {
    this.cartService.addOne(product);
  }

  public isInCart(id: string | undefined): number {
    return id ? this.cartService.howManyAreOfOne(id) : 0;
  }

  public goToDetails(product: ProductModel): void {
    this.selectedItem = product;
    this.toggleDetails = true;
  }

  public getBgImage(product: ProductModel): string {
    const img = product?.image;
    if (!img?.base64 || !img?.contentType) return 'none';
    return `url("data:${img.contentType};base64,${img.base64}")`;
  }

  public deleteProduct(id: string): void {
   this._products.deleteProduct(id).pipe(
     catchError((err: HttpErrorResponse) => {
       if (err.error?.code === 404) {
         this._ns.error(
           'Produs inexistent.',
           { title: 'Delete Product', durationMs: 4000 }
         );
       }

       return throwError(() => err);
     })).subscribe(() => {
       this._ns.success('Success', { title: 'Delete Product', durationMs: 4000 })
     }
   )
  }
}
