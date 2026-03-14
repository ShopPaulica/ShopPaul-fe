import {Component, DestroyRef, Inject, inject, OnInit} from '@angular/core';
import {ProductsServices} from '../../shared/services/products.services';
import {ProductModel, ProductsPaginationModel} from '../../shared/interfaces/product.model';
import {FormsModule} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import {CartService} from '../../shared/services/cart.service';
import {NavigationService} from '../../shared/services/router-service';
import {SlideMenuComponent} from '../../components/slide-menu/slide-menu.component';
import {detailsModalComponent} from '../../components/details-modal/details-modal.component';
import {catchError, takeUntil, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../../shared/services/notification.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthService} from '../../shared/services/auth.service';
import {DATA_PROVIDER_TOKEN} from '../../shared/services/admin/const/data-provider-token';
import {VehiclesDTO} from '../../shared/services/admin/vechicles/models/vehiclesDTO';
import {VehicleArgs} from '../../shared/services/admin/vechicles/models/vehicle-filters-model';
import {VehicleState} from '../../shared/services/admin/vechicles/models/vehicle-state-model';
import {DataProviderModel} from '../../shared/services/admin/model/data-provider-facade.model';

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
  private readonly destroyRef = inject(DestroyRef);
  private _isLoggedIn: boolean = false;
  protected products: ProductModel[] = [];
  public search: string = '';
  public toggleDetails: boolean = false;
  public selectedItem!: ProductModel;
  public totalPages: number = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public firstPage!: number;
  public lastPage!: number;
  public brands: string[] = [];
  public models: string[] = [];
  public engines: string[] = [];
  public fuels: string[] = [];
  public powers: string[] = [];
  private brand: string = '';
  private model: string = '';
  private engine: string = '';
  private fuel: string = '';
  private power: string = '';


  constructor(
    private _products: ProductsServices,
    private _auth: AuthService,
    @Inject(DATA_PROVIDER_TOKEN) public vehicleService: DataProviderModel<VehiclesDTO, VehicleArgs, VehicleState>,
    private readonly _ns: NotificationService,
    private cartService: CartService,
    protected routersService: NavigationService) {}

  public ngOnInit(): void {
    this._products.loadProducts(this.currentPage);
    this._isLoggedIn = this._auth.isLoggedIn ?? false;
    this._products.productsPage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: ProductsPaginationModel | null) => {
      if(res) {
        this.products = res.items;
        this.pages = res.pages;
        this.firstPage = res.pages[0];
        this.lastPage = res.totalPages;
        this.currentPage = res.page;
        this.totalPages = res.totalPages;
      }
    });
  }

  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  public get pagesToShow(): number[] {
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
    this._products.loadProducts(page);
  }

  public removeFromCart(product: ProductModel): void {
    this.cartService.removeOne(product);
  }

  public addToCart(product: ProductModel): void {
    this.cartService.addOne(product);
  }

  protected initSubscription(): void {
    this.vehicleService.brandFiltersPage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((brands: string[] | null) => this.brands = brands ?? []);
    this.vehicleService.modelFiltersPage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((models: string[] | null) => this.models = models ?? []);
    this.vehicleService.engineFiltersPage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((engines: string[] | null) => this.engines = engines ?? []);
    this.vehicleService.fuelFiltersPage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fuels: string[] | null) => this.fuels = fuels ?? []);
    this.vehicleService.powerFiltersPage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((powers: string[] | null) => this.powers = powers ?? []);
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

  public brandSelected(brand: string) {
    if(brand) {
      this.vehicleService.fetchFilter(brand);
    } else {
      this.initFilters();
    }
    this.brand = brand;
  }

  protected initFilters(): void {
    this.vehicleService.fetchData();
  }

  public modelSelected(model: string) {
    if(model && this.brand) {
      this.vehicleService.fetchFilter(this.brand, model);
    } else if(this.brand) {
      this.vehicleService.fetchFilter(this.brand);
    }
    this.model = model;
  }

  public enginesSelected(engine: string) {
    if(engine) {
      this.vehicleService.fetchFilter(this.brand, this.model,this.fuel, engine);
    } else if(this.brand) {
      this.vehicleService.fetchFilter(this.brand, this.model,this.fuel);
    }
    this.engine = engine;
  }


  public powersSelected(power: string) {
    if(power) {
      this.vehicleService.fetchFilter(this.brand, this.model,this.fuel, this.engine, power);
    } else if(this.brand) {
      this.vehicleService.fetchFilter(this.brand, this.model,this.fuel, this.engine);
    }
    this.power = power;
  }

  public fuelSelected(fuel: string) {
    if(fuel) {
      this.vehicleService.fetchFilter(this.brand, this.model, fuel);
    } else if(this.brand) {
      this.vehicleService.fetchFilter(this.brand, this.model);
    }
    this.fuel = fuel;
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
       this._products.loadProducts(this.currentPage);
     }
   )
  }
}
