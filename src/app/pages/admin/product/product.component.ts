import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { ordersListComponent } from '../../../components/commands-list/orders-list.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProductsServices } from '../../../shared/services/products.services';
import { VehiclesFacade } from '../../../shared/services/admin/vechicles/facade/vehicles.facade';
import { PartsFacade } from '../../../shared/services/admin/parts/facade/parts-facade.service';
import {DropdownComponent} from '../../../components/dropdown/dropdown.component';

@Component({
  selector: 'app-product',
  imports: [
    ReactiveFormsModule,
    ordersListComponent,
    DropdownComponent,
    AsyncPipe,
    DatePipe,
    FormsModule,
    NgIf,
    NgForOf,
  ],
  providers: [
    VehiclesFacade,
    PartsFacade
  ],
  templateUrl: './product.component.html',
  standalone: true,
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  public formProduct!: FormGroup;
  public previewUrl: string | null = null;
  public selectedFileName = '';

  public brands: string[] = [];
  public models: string[] = [];
  public engines: string[] = [];
  public fuels: string[] = [];
  public powers: string[] = [];

  public sections: string[] = [];
  public subsections: string[] = [];
  public titles: string[] = [];

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _ps: ProductsServices,
    private readonly _ns: NotificationService,
    public vehicleService: VehiclesFacade,
    public partsService: PartsFacade
  ) {}

  public ngOnInit(): void {
    this.formProduct = this._fb.group({
      image: [null as File | null, [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
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

    this.initVehicleSubscription();
    this.initPartsSubscription();

    this.vehicleService.fetchFilterData();
    this.partsService.fetchFiltersData();
  }

  private initVehicleSubscription(): void {
    this.vehicleService.brandFiltersPage$.subscribe((brands: string[] | null) => {
      this.brands = brands ?? [];
    });

    this.vehicleService.modelFiltersPage$.subscribe((models: string[] | null) => {
      this.models = models ?? [];
    });

    this.vehicleService.engineFiltersPage$.subscribe((engines: string[] | null) => {
      this.engines = engines ?? [];
    });

    this.vehicleService.fuelFiltersPage$.subscribe((fuels: string[] | null) => {
      this.fuels = fuels ?? [];
    });

    this.vehicleService.powerFiltersPage$.subscribe((powers: string[] | null) => {
      this.powers = powers ?? [];
    });
  }

  private initPartsSubscription(): void {
    this.partsService.sectionFiltersPage$.subscribe((sections: string[] | null) => {
      this.sections = sections ?? [];
    });

    this.partsService.subsectionFiltersPage$.subscribe((subsections: string[] | null) => {
      this.subsections = subsections ?? [];
    });

    this.partsService.titleFiltersPage$.subscribe((titles: string[] | null) => {
      this.titles = titles ?? [];
    });
  }

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.formProduct.get('image')?.setValue(file);
    this.formProduct.get('image')?.updateValueAndValidity();

    if (!file) {
      this.previewUrl = null;
      this.selectedFileName = '';
      return;
    }

    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  public brandSelected(brand: string | null): void {
    this.formProduct.patchValue({
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

    if (brand) {
      this.vehicleService.fetchFilterData(brand);
    } else {
      this.vehicleService.fetchFilterData();
    }
  }

  public modelSelected(model: string | null): void {
    const brand = this.formProduct.get('brand')?.value || '';

    this.formProduct.patchValue({
      model: model || '',
      fuel: '',
      engine: '',
      power: ''
    });

    this.fuels = [];
    this.engines = [];
    this.powers = [];

    if (brand && model) {
      this.vehicleService.fetchFilterData(brand, model);
    } else if (brand) {
      this.vehicleService.fetchFilterData(brand);
    } else {
      this.vehicleService.fetchFilterData();
    }
  }

  public fuelSelected(fuel: string | null): void {
    const brand = this.formProduct.get('brand')?.value || '';
    const model = this.formProduct.get('model')?.value || '';

    this.formProduct.patchValue({
      fuel: fuel || '',
      engine: '',
      power: ''
    });

    this.engines = [];
    this.powers = [];

    if (brand && model && fuel) {
      this.vehicleService.fetchFilterData(brand, model, fuel);
    } else if (brand && model) {
      this.vehicleService.fetchFilterData(brand, model);
    }
  }

  public engineSelected(engine: string | null): void {
    const brand = this.formProduct.get('brand')?.value || '';
    const model = this.formProduct.get('model')?.value || '';
    const fuel = this.formProduct.get('fuel')?.value || '';

    this.formProduct.patchValue({
      engine: engine || '',
      power: ''
    });

    this.powers = [];

    if (brand && model && fuel && engine) {
      this.vehicleService.fetchFilterData(brand, model, fuel, engine);
    } else if (brand && model && fuel) {
      this.vehicleService.fetchFilterData(brand, model, fuel);
    }
  }

  public powerSelected(power: string | null): void {
    this.formProduct.patchValue({
      power: power || ''
    });
  }

  public sectionSelected(section: string | null): void {
    this.formProduct.patchValue({
      section: section || '',
      subsection: '',
      title: ''
    });

    this.subsections = [];
    this.titles = [];

    if (section) {
      this.partsService.fetchFiltersData(section);
    } else {
      this.partsService.fetchFiltersData();
    }
  }

  public subsectionSelected(subsection: string | null): void {
    const section = this.formProduct.get('section')?.value || '';

    this.formProduct.patchValue({
      subsection: subsection || '',
      title: ''
    });

    this.titles = [];

    if (section && subsection) {
      this.partsService.fetchFiltersData(section, subsection);
    } else if (section) {
      this.partsService.fetchFiltersData(section);
    }
  }

  public titleSelected(title: string | null): void {
    this.formProduct.patchValue({
      title: title || ''
    });
  }

  public saveProduct(): void {
    if (this.formProduct.invalid) {
      this.formProduct.markAllAsTouched();
      return;
    }

    this._ps.saveProduct({
      name: this.formProduct.controls['name'].value,
      description: this.formProduct.controls['description'].value,
      image: this.formProduct.controls['image'].value,
      price: this.formProduct.controls['price'].value,

      brand: this.formProduct.controls['brand'].value,
      model: this.formProduct.controls['model'].value,
      fuel: this.formProduct.controls['fuel'].value,
      engine: this.formProduct.controls['engine'].value,
      power: this.formProduct.controls['power'].value,

      section: this.formProduct.controls['section'].value,
      subsection: this.formProduct.controls['subsection'].value,
      title: this.formProduct.controls['title'].value,
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.error?.code === 400) {
          this._ns.error(
            'Numele și prețul produsului sunt obligatorii.',
            { title: 'Produs', durationMs: 4000 }
          );
        } else {
          this._ns.error(
            'Nu am putut salva produsul. Eroare de server.',
            { title: 'Produs', durationMs: 4000 }
          );
        }

        return throwError(() => err);
      })
    ).subscribe(() => {
      this._ns.success('Produsul a fost salvat cu succes.', {
        title: 'Creare produs',
        durationMs: 4000
      });

      this.formProduct.reset({
        image: null,
        name: '',
        description: '',
        price: 0,
        brand: '',
        model: '',
        fuel: '',
        engine: '',
        power: '',
        section: '',
        subsection: '',
        title: '',
      });

      this.previewUrl = null;
      this.selectedFileName = '';

      this.models = [];
      this.fuels = [];
      this.engines = [];
      this.powers = [];
      this.subsections = [];
      this.titles = [];

      this.vehicleService.fetchFilterData();
      this.partsService.fetchFiltersData();
    });
  }
}
