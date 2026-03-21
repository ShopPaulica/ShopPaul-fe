import { Component, DestroyRef, Inject, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductsServices } from '../../shared/services/products.services';
import { ProductModel, ProductsPaginationModel } from '../../shared/interfaces/product.model';
import { CartService } from '../../shared/services/cart.service';
import { NavigationService } from '../../shared/services/router-service';
import { SlideMenuComponent } from '../../components/slide-menu/slide-menu.component';
import { detailsModalComponent } from '../../components/details-modal/details-modal.component';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthService } from '../../shared/services/auth.service';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { VehiclesFacade } from '../../shared/services/admin/vechicles/facade/vehicles.facade';
import { PartsFacade } from '../../shared/services/admin/parts/facade/parts-facade.service';

@Component({
  selector: 'app-products',
  imports: [
    FormsModule,
    DecimalPipe,
    SlideMenuComponent,
    detailsModalComponent,
    DropdownComponent
  ],
  providers: [
    VehiclesFacade,
    PartsFacade
  ],
  templateUrl: './products.component.html',
  standalone: true,
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private _isLoggedIn = false;

  protected products: ProductModel[] = [];
  public search = '';
  public toggleDetails = false;
  public selectedItem!: ProductModel;

  public totalPages = 0;
  public currentPage = 1;
  public pages: number[] = [];
  public firstPage = 1;
  public lastPage = 1;

  public brands: string[] = [];
  public models: string[] = [];
  public engines: string[] = [];
  public fuels: string[] = [];
  public powers: string[] = [];

  public sections: string[] = [];
  public subsections: string[] = [];
  public titles: string[] = [];

  public brand = '';
  public model = '';
  public engine = '';
  public fuel = '';
  public power = '';

  public section = '';
  public subsection = '';
  public title = '';

  constructor(
    private readonly _products: ProductsServices,
    private readonly _auth: AuthService,
    public vehicleService: VehiclesFacade,
    public partsService: PartsFacade,
    private readonly _ns: NotificationService,
    private readonly cartService: CartService,
    protected readonly routersService: NavigationService
  ) {}

  public ngOnInit(): void {
    this._products.loadProducts(this.currentPage);
    this._isLoggedIn = this._auth.isLoggedIn ?? false;

    this.initVehicleSubscription();
    this.initPartsSubscription();

    this.vehicleService.fetchFilterData();
    this.partsService.fetchFiltersData();

    this._products.productsPage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: ProductsPaginationModel | null) => {
        if (res) {
          this.products = res.items;
          this.pages = res.pages;
          this.firstPage = res.pages[0] ?? 1;
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

  private initVehicleSubscription(): void {
    this.vehicleService.brandFiltersPage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((brands: string[] | null) => this.brands = brands ?? []);

    this.vehicleService.modelFiltersPage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((models: string[] | null) => this.models = models ?? []);

    this.vehicleService.engineFiltersPage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((engines: string[] | null) => this.engines = engines ?? []);

    this.vehicleService.fuelFiltersPage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((fuels: string[] | null) => this.fuels = fuels ?? []);

    this.vehicleService.powerFiltersPage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((powers: string[] | null) => this.powers = powers ?? []);
  }

  private initPartsSubscription(): void {
    this.partsService.sectionFiltersPage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((sections: string[] | null) => this.sections = sections ?? []);

    this.partsService.subsectionFiltersPage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((subsections: string[] | null) => this.subsections = subsections ?? []);

    this.partsService.titleFiltersPage$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((titles: string[] | null) => this.titles = titles ?? []);
  }

  public brandSelected(brand: string): void {
    this.brand = brand;
    this.model = '';
    this.fuel = '';
    this.engine = '';
    this.power = '';

    this.models = [];
    this.fuels = [];
    this.engines = [];
    this.powers = [];

    if (brand) this.vehicleService.fetchFilterData(brand);
    else this.vehicleService.fetchFilterData();
  }

  public modelSelected(model: string): void {
    this.model = model;
    this.fuel = '';
    this.engine = '';
    this.power = '';

    this.fuels = [];
    this.engines = [];
    this.powers = [];

    if (model && this.brand) this.vehicleService.fetchFilterData(this.brand, model);
    else if (this.brand) this.vehicleService.fetchFilterData(this.brand);
  }

  public fuelSelected(fuel: string): void {
    this.fuel = fuel;
    this.engine = '';
    this.power = '';

    this.engines = [];
    this.powers = [];

    if (fuel && this.brand && this.model) this.vehicleService.fetchFilterData(this.brand, this.model, fuel);
    else if (this.brand && this.model) this.vehicleService.fetchFilterData(this.brand, this.model);
  }

  public enginesSelected(engine: string): void {
    this.engine = engine;
    this.power = '';

    this.powers = [];

    if (engine && this.brand && this.model && this.fuel) {
      this.vehicleService.fetchFilterData(this.brand, this.model, this.fuel, engine);
    } else if (this.brand && this.model && this.fuel) {
      this.vehicleService.fetchFilterData(this.brand, this.model, this.fuel);
    }
  }

  public powersSelected(power: string): void {
    this.power = power;

    if (power && this.brand && this.model && this.fuel && this.engine) {
      this.vehicleService.fetchFilterData(this.brand, this.model, this.fuel, this.engine, power);
    } else if (this.brand && this.model && this.fuel && this.engine) {
      this.vehicleService.fetchFilterData(this.brand, this.model, this.fuel, this.engine);
    }
  }

  public sectionSelected(section: string): void {
    this.section = section;
    this.subsection = '';
    this.title = '';

    this.subsections = [];
    this.titles = [];

    if (section) this.partsService.fetchFiltersData(section);
    else this.partsService.fetchFiltersData();
  }

  public subsectionSelected(subsection: string): void {
    this.subsection = subsection;
    this.title = '';

    this.titles = [];

    if (subsection && this.section) this.partsService.fetchFiltersData(this.section, subsection);
    else if (this.section) this.partsService.fetchFiltersData(this.section);
  }

  public titleSelected(title: string): void {
    this.title = title;

    if (title && this.section && this.subsection) {
      this.partsService.fetchFiltersData(this.section, this.subsection, title);
    } else if (this.section && this.subsection) {
      this.partsService.fetchFiltersData(this.section, this.subsection);
    }
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
    this._products.deleteProduct(id)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.error?.code === 404) {
            this._ns.error('Produs inexistent.', {
              title: 'Delete Product',
              durationMs: 4000
            });
          }
          return throwError(() => err);
        })
      )
      .subscribe(() => {
        this._ns.success('Success', {
          title: 'Delete Product',
          durationMs: 4000
        });
        this._products.loadProducts(this.currentPage);
      });
  }
}
