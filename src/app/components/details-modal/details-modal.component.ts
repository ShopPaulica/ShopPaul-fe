import { DecimalPipe, NgIf } from '@angular/common';
import { Component, effect, inject, input, Input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, EMPTY, forkJoin, of } from 'rxjs';

import { ProductModel } from '../../shared/interfaces/product.model';
import { CartService } from '../../shared/services/cart.service';
import { ProductsServices } from '../../shared/services/products.services';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthService } from '../../shared/services/auth.service';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { VehiclesFacade } from '../../shared/services/admin/vechicles/facade/vehicles.facade';
import { PartsFacade } from '../../shared/services/admin/parts/facade/parts-facade.service';

@Component({
  selector: 'app-details-modal',
  imports: [NgIf, DecimalPipe, ReactiveFormsModule, DropdownComponent],
  standalone: true,
  templateUrl: './details-modal.component.html',
  styleUrl: './details-modal.component.scss',
  providers: [VehiclesFacade, PartsFacade]
})
export class detailsModalComponent {
  private readonly cartService = inject(CartService);
  private readonly productsService = inject(ProductsServices);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  public openChange = output<boolean>();
  public productUpdated = output<ProductModel>();
  public selectedItem = input.required<ProductModel>();

  @Input() public set toggleMenu(bool: boolean) {
    this.isOpen = bool;

    if (bool) {
      this.isEditing = false;
      this.previewUrl = null;
      this.selectedFile = null;
      this.selectedFileName = '';
      this.resetFormFromProduct();
    }
  }

  public isOpen = false;
  public isEditing = false;
  public isSaving = false;

  public previewUrl: string | null = null;
  public selectedFile: File | null = null;
  public selectedFileName = '';

  public brands: string[] = [];
  public models: string[] = [];
  public engines: string[] = [];
  public fuels: string[] = [];
  public powers: string[] = [];

  public sections: string[] = [];
  public subsections: string[] = [];
  public titles: string[] = [];

  public formEdit: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    price: [0, [Validators.required]],

    brand: [''],
    model: [''],
    fuel: [''],
    engine: [''],
    power: [''],

    section: [''],
    subsection: [''],
    title: [''],
  });

  constructor(
    public vehicleService: VehiclesFacade,
    public partsService: PartsFacade
  ) {
    effect(() => {
      const product = this.selectedItem();
      if (product) {
        this.resetFormFromProduct();
      }
    });

    this.vehicleService.brandFiltersPage$.subscribe((v) => this.brands = v ?? []);
    this.vehicleService.modelFiltersPage$.subscribe((v) => this.models = v ?? []);
    this.vehicleService.engineFiltersPage$.subscribe((v) => this.engines = v ?? []);
    this.vehicleService.fuelFiltersPage$.subscribe((v) => this.fuels = v ?? []);
    this.vehicleService.powerFiltersPage$.subscribe((v) => this.powers = v ?? []);

    this.partsService.sectionFiltersPage$.subscribe((v) => this.sections = v ?? []);
    this.partsService.subsectionFiltersPage$.subscribe((v) => this.subsections = v ?? []);
    this.partsService.titleFiltersPage$.subscribe((v) => this.titles = v ?? []);

    this.vehicleService.fetchFilterData();
    this.partsService.fetchFiltersData();
  }

  public get isAdmin(): boolean {
    return this.authService.isLoggedIn ?? false;
  }

  public get isInCart(): number {
    return this.selectedItem()?.id ? this.cartService.howManyAreOfOne(this.selectedItem()?.id) : 0;
  }

  public closeMenu(): void {
    this.isOpen = false;
    this.isEditing = false;
    this.openChange.emit(false);
  }

  public enableEdit(): void {
    this.isEditing = true;
    this.previewUrl = null;
    this.selectedFile = null;
    this.selectedFileName = '';
    this.resetFormFromProduct();
  }

  public cancelEdit(): void {
    this.isEditing = false;
    this.previewUrl = null;
    this.selectedFile = null;
    this.selectedFileName = '';
    this.resetFormFromProduct();
  }

  public removeFromCart(): void {
    this.cartService.removeOne(this.selectedItem());
  }

  public addToCart(): void {
    this.cartService.addOne(this.selectedItem());
  }

  public getBgImage(product?: ProductModel): string {
    const img = product?.image;
    if (!img?.base64 || !img?.contentType) return 'none';
    return `url("data:${img.contentType};base64,${img.base64}")`;
  }

  public get currentImage(): string {
    return this.previewUrl || this.getBgImage(this.selectedItem());
  }

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedFile = null;
      this.selectedFileName = '';
      this.previewUrl = null;
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  public brandSelected(brand: string | null): void {
    this.formEdit.patchValue({
      brand: brand || '',
      model: '',
      fuel: '',
      engine: '',
      power: ''
    });

    this.models = [];
    this.fuels = [];
    this.engines = [];
    this.powers = [];

    if (brand) this.vehicleService.fetchFilterData(brand);
    else this.vehicleService.fetchFilterData();
  }

  public modelSelected(model: string | null): void {
    const brand = this.formEdit.get('brand')?.value || '';

    this.formEdit.patchValue({
      model: model || '',
      fuel: '',
      engine: '',
      power: ''
    });

    this.fuels = [];
    this.engines = [];
    this.powers = [];

    if (brand && model) this.vehicleService.fetchFilterData(brand, model);
    else if (brand) this.vehicleService.fetchFilterData(brand);
    else this.vehicleService.fetchFilterData();
  }

  public fuelSelected(fuel: string | null): void {
    const brand = this.formEdit.get('brand')?.value || '';
    const model = this.formEdit.get('model')?.value || '';

    this.formEdit.patchValue({
      fuel: fuel || '',
      engine: '',
      power: ''
    });

    this.engines = [];
    this.powers = [];

    if (brand && model && fuel) this.vehicleService.fetchFilterData(brand, model, fuel);
    else if (brand && model) this.vehicleService.fetchFilterData(brand, model);
    else if (brand) this.vehicleService.fetchFilterData(brand);
    else this.vehicleService.fetchFilterData();
  }

  public engineSelected(engine: string | null): void {
    const brand = this.formEdit.get('brand')?.value || '';
    const model = this.formEdit.get('model')?.value || '';
    const fuel = this.formEdit.get('fuel')?.value || '';

    this.formEdit.patchValue({
      engine: engine || '',
      power: ''
    });

    this.powers = [];

    if (brand && model && fuel && engine) {
      this.vehicleService.fetchFilterData(brand, model, fuel, engine);
    } else if (brand && model && fuel) {
      this.vehicleService.fetchFilterData(brand, model, fuel);
    } else {
      this.vehicleService.fetchFilterData();
    }
  }

  public powerSelected(power: string | null): void {
    this.formEdit.patchValue({ power: power || '' });
  }

  public sectionSelected(section: string | null): void {
    this.formEdit.patchValue({
      section: section || '',
      subsection: '',
      title: ''
    });

    this.subsections = [];
    this.titles = [];

    if (section) this.partsService.fetchFiltersData(section);
    else this.partsService.fetchFiltersData();
  }

  public subsectionSelected(subsection: string | null): void {
    const section = this.formEdit.get('section')?.value || '';

    this.formEdit.patchValue({
      subsection: subsection || '',
      title: ''
    });

    this.titles = [];

    if (section && subsection) this.partsService.fetchFiltersData(section, subsection);
    else if (section) this.partsService.fetchFiltersData(section);
    else this.partsService.fetchFiltersData();
  }

  public titleSelected(title: string | null): void {
    this.formEdit.patchValue({ title: title || '' });
  }

  public saveChanges(): void {
    const product = this.selectedItem();

    if (!product?.id || this.formEdit.invalid) {
      this.formEdit.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const payload = {
      name: this.formEdit.get('name')?.value,
      description: this.formEdit.get('description')?.value,
      price: Number(this.formEdit.get('price')?.value),

      brand: this.formEdit.get('brand')?.value,
      model: this.formEdit.get('model')?.value,
      fuel: this.formEdit.get('fuel')?.value,
      engine: this.formEdit.get('engine')?.value,
      power: this.formEdit.get('power')?.value,

      section: this.formEdit.get('section')?.value,
      subsection: this.formEdit.get('subsection')?.value,
      title: this.formEdit.get('title')?.value,
    };

    const updateText$ = this.productsService.updateProduct(product.id, payload);
    const updateImage$ = this.selectedFile
      ? this.productsService.updateProductImage(product.id, this.selectedFile)
      : of(null);

    forkJoin([updateText$, updateImage$])
      .pipe(
        catchError(() => {
          this.notificationService.error('Nu am putut salva modificările.', {
            title: 'Edit product',
            durationMs: 4000
          });
          this.isSaving = false;
          return EMPTY;
        })
      )
      .subscribe(([updatedText, updatedImage]) => {
        const freshProduct: ProductModel = {
          ...product,
          ...updatedText,
          name: payload.name,
          description: payload.description,
          price: payload.price,
          brand: payload.brand || '',
          model: payload.model || '',
          fuel: payload.fuel || '',
          engine: payload.engine || '',
          power: payload.power || '',
          section: payload.section || '',
          subsection: payload.subsection || '',
          title: payload.title || '',
          image: updatedImage?.image || updatedText?.image || product.image,
        };

        this.notificationService.success('Produs actualizat cu succes.', {
          title: 'Edit product',
          durationMs: 4000
        });

        this.productUpdated.emit(freshProduct);
        this.isSaving = false;
        this.isEditing = false;
        this.previewUrl = null;
        this.selectedFile = null;
        this.selectedFileName = '';
        this.closeMenu();
      });
  }

  private resetFormFromProduct(): void {
    const product = this.selectedItem();

    if (!product) {
      return;
    }

    this.formEdit.patchValue({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? 0,

      brand: product.brand || '',
      model: product.model || '',
      fuel: product.fuel || '',
      engine: product.engine || '',
      power: product.power || '',

      section: product.section || '',
      subsection: product.subsection || '',
      title: product.title || '',
    });

    if (product.brand) {
      this.vehicleService.fetchFilterData(
        product.brand,
        product.model || '',
        product.fuel || '',
        product.engine || '',
        product.power || ''
      );
    } else {
      this.vehicleService.fetchFilterData();
    }

    if (product.section) {
      this.partsService.fetchFiltersData(
        product.section,
        product.subsection || '',
        product.title || ''
      );
    } else {
      this.partsService.fetchFiltersData();
    }
  }
}
