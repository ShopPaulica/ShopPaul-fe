import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ordersListComponent} from '../../../components/commands-list/orders-list.component';
import {NotificationService} from '../../../shared/services/notification.service';
import {catchError, Observable, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {VehiclesServices} from '../../../shared/services/vehicles.services';
import {DropdownComponent} from '../../../components/dropdown/dropdown.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-vehicles',
  imports: [
    ReactiveFormsModule,
    ordersListComponent,
    DropdownComponent,
    AsyncPipe,
  ],
  templateUrl: './vehicles.component.html',
  standalone: true,
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent implements OnInit {
  public formVehicles!: FormGroup;
  public brands: string[] = [];
  public models: string[] = [];
  public engines: string[] = [];
  public fuels: string[] = [];
  public powers: string[] = [];
  public selectedTab: number = 2;
  private brand: string = '';
  private model: string = '';
  private engine: string = '';
  private fuel: string = '';
  private power: string = '';

  constructor(
    private _fb: FormBuilder,
    private _vs: VehiclesServices,
    private readonly _ns: NotificationService
  ) {}

  ngOnInit(): void {
    this._vs.brandFiltersPage$.pipe(
      //todo
    ).subscribe((brands: string[] | null) => {
      this.brands = brands ?? []
    })
    this._vs.modelFiltersPage$.pipe(
      //todo
    ).subscribe((models: string[] | null) => {
      this.models = models ?? []
    })
    this._vs.engineFiltersPage$.pipe(
      //todo
    ).subscribe((engines: string[] | null) => {
      this.engines = engines ?? []
    })
    this._vs.fuelFiltersPage$.pipe(
      //todo
    ).subscribe((fuels: string[] | null) => {
      this.fuels = fuels ?? []
    })
    this._vs.powerFiltersPage$.pipe(
      //todo
    ).subscribe((powers: string[] | null) => {
      this.powers = powers ?? []
    })

    this.formVehicles = this._fb.group({
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      fuel: ['', [Validators.required]],
      power: ['', [Validators.required]],
      engine: ['', [Validators.required]],
    });

    this.initVehicleBrands();
  }

  public saveVehicles() {
    this._vs.saveVehicle({
      brand: this.formVehicles.controls['brand'].value,
      model: this.formVehicles.controls['model'].value,
      fuel: this.formVehicles.controls['fuel'].value,
      engine: this.formVehicles.controls['engine'].value,
      power: this.formVehicles.controls['power'].value,
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        this._ns.error(
          'Nu am putut salva produsul. Eroare de server.',
          { title: 'Vehicle', durationMs: 4000 }
        );

        return throwError(() => err);
      })).subscribe(() => {
        this._ns.success('Success', { title: 'Create Vehicle', durationMs: 4000 });
        this.initVehicleBrands();
      }
    )
  }

  public selectTab(nr: number): void {
    this.selectedTab = nr;
  }

  public brandSelected(brand: string) {
    if(brand) {
      this._vs.getFilters(brand);
    } else {
      this.initVehicleBrands();
    }
    this.brand = brand;
  }

  public modelSelected(model: string) {
    if(model && this.brand) {
      this._vs.getFilters(this.brand, model);
    } else if(this.brand) {
      this._vs.getFilters(this.brand);
    }
    this.model = model;
  }

  public enginesSelected(engine: string) {
    if(engine) {
      this._vs.getFilters(this.brand, this.model,this.fuel, engine);
    } else if(this.brand) {
      this._vs.getFilters(this.brand, this.model,this.fuel);
    }
    this.engine = engine;
  }


  public powersSelected(power: string) {
    if(power) {
      this._vs.getFilters(this.brand, this.model,this.fuel, this.engine, power);
    } else if(this.brand) {
      this._vs.getFilters(this.brand, this.model,this.fuel, this.engine);
    }
    this.power = power;
  }

  public fuelSelected(fuel: string) {
    if(fuel) {
      this._vs.getFilters(this.brand, this.model, fuel);
    } else if(this.brand) {
      this._vs.getFilters(this.brand, this.model);
    }
    this.fuel = fuel;
  }

  //todo muta in service toate astea
  public deleteVehicles(): void {
   this._vs.deleteProduct({
     brand: this.brand,
     model: this.model,
     fuel: this.fuel,
     engine: this.engine,
     power: this.power,
   }).pipe(
     //todo
   ).subscribe(
     res => {
       console.log(res)
     }
   )
  }

  private initVehicleBrands(): void {
    this._vs.getFilters();
  }
}
