import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ordersListComponent} from '../../../components/commands-list/orders-list.component';
import {NotificationService} from '../../../shared/services/notification.service';
import {catchError, takeUntil, tap, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {DropdownComponent} from '../../../components/dropdown/dropdown.component';
import {AsyncPipe} from '@angular/common';
import {AdminCrudActionsBase} from '../models/admin-crud-actions';
import {VehiclesFacade} from '../../../shared/services/admin/vechicles/facade/vehicles.facade';
import {DATA_PROVIDER_TOKEN} from '../../../shared/services/admin/const/data-provider-token';
import {DataProviderModel} from '../../../shared/services/admin/model/data-provider-facade.model';
import {VehiclesDTO} from '../../../shared/services/admin/vechicles/models/vehiclesDTO';
import {VehicleArgs} from '../../../shared/services/admin/vechicles/models/vehicle-filters-model';
import {VehicleState} from '../../../shared/services/admin/vechicles/models/vehicle-state-model';

@Component({
  selector: 'app-vehicles',
  imports: [
    ReactiveFormsModule,
    ordersListComponent,
    DropdownComponent,
    AsyncPipe,
  ],
  providers: [
    {
      provide: DATA_PROVIDER_TOKEN,
      useExisting: VehiclesFacade,
    }
  ],
  templateUrl: './vehicles.component.html',
  standalone: true,
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent extends AdminCrudActionsBase<VehiclesDTO, VehicleArgs, VehicleState> implements OnInit {
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
    fb: FormBuilder,
    @Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProviderModel<VehiclesDTO, VehicleArgs, VehicleState>,
    private readonly _ns: NotificationService
  ) {
    super(fb, dataProvider);
  }

  ngOnInit(): void {
    this.initBase();
  }

  public brandSelected(brand: string) {
    if(brand) {
      this.dataProvider.fetchData(brand);
    } else {
      this.initFilters();
    }
    this.brand = brand;
  }

  public modelSelected(model: string) {
    if(model && this.brand) {
      this.dataProvider.fetchData(this.brand, model);
    } else if(this.brand) {
      this.dataProvider.fetchData(this.brand);
    }
    this.model = model;
  }

  public enginesSelected(engine: string) {
    if(engine) {
      this.dataProvider.fetchData(this.brand, this.model,this.fuel, engine);
    } else if(this.brand) {
      this.dataProvider.fetchData(this.brand, this.model,this.fuel);
    }
    this.engine = engine;
  }


  public powersSelected(power: string) {
    if(power) {
      this.dataProvider.fetchData(this.brand, this.model,this.fuel, this.engine, power);
    } else if(this.brand) {
      this.dataProvider.fetchData(this.brand, this.model,this.fuel, this.engine);
    }
    this.power = power;
  }

  public fuelSelected(fuel: string) {
    if(fuel) {
      this.dataProvider.fetchData(this.brand, this.model, fuel);
    } else if(this.brand) {
      this.dataProvider.fetchData(this.brand, this.model);
    }
    this.fuel = fuel;
  }

  public deleteByFilters(): void {
   this.dataProvider.deleteData({
     brand: this.brand,
     model: this.model,
     fuel: this.fuel,
     engine: this.engine,
     power: this.power,
   }).subscribe(
       (res: any) => {
         //todo
         this._ns.success('Success', { title: 'Delete Vehicle', durationMs: 4000 });
     }
   )
  }

  public save() {
    this.saveData().pipe(
      tap(() => {
        this._ns.success('Success', { title: 'Create Vehicle', durationMs: 4000 });
        this.initFilters();
      }),
      catchError((err: HttpErrorResponse) => {
        this._ns.error('Nu am putut salva produsul. Eroare de server.', { title: 'Vehicle', durationMs: 4000 });
        return throwError(() => err);
      })
    ).subscribe();
  }

  protected initFilters(): void {
    this.dataProvider.fetchData();
  }

  protected initSubscription(): void {
    this.dataProvider.brandFiltersPage$.pipe(takeUntil(this.destroy$)).subscribe((brands: string[] | null) => this.brands = brands ?? []);
    this.dataProvider.modelFiltersPage$.pipe(takeUntil(this.destroy$)).subscribe((models: string[] | null) => this.models = models ?? []);
    this.dataProvider.engineFiltersPage$.pipe(takeUntil(this.destroy$)).subscribe((engines: string[] | null) => this.engines = engines ?? []);
    this.dataProvider.fuelFiltersPage$.pipe(takeUntil(this.destroy$)).subscribe((fuels: string[] | null) => this.fuels = fuels ?? []);
    this.dataProvider.powerFiltersPage$.pipe(takeUntil(this.destroy$)).subscribe((powers: string[] | null) => this.powers = powers ?? []);
  }

  protected initGroupForm(): void {
    this.formGroup = this._fb.group({
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      fuel: ['', [Validators.required]],
      power: ['', [Validators.required]],
      engine: ['', [Validators.required]],
    });
  }
}
