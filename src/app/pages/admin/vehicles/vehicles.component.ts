import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, takeUntil, tap, throwError } from 'rxjs';

import { NotificationService } from '../../../shared/services/notification.service';
import { VehiclesFacade } from '../../../shared/services/admin/vechicles/facade/vehicles.facade';
import { DATA_PROVIDER_TOKEN } from '../../../shared/services/admin/const/data-provider-token';
import { VehiclesDTO } from '../../../shared/services/admin/vechicles/models/vehiclesDTO';
import { VehicleState } from '../../../shared/services/admin/vechicles/models/vehicle-state-model';
import { IVehicleFilters, VehicleArgs } from '../../../shared/services/admin/vechicles/models/vehicle-filters-model';
import { AdminCrudActionsBase } from '../models/admin-crud-actions';
import { VehiclesFetchDataModel } from '../../../shared/services/admin/vechicles/models/vehicles-fetch-data.model';

@Component({
  selector: 'app-vehicles',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
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
  public vehicles: VehiclesDTO[] = [];

  public filters: IVehicleFilters = {
    page: '1',
    brand: '',
    model: '',
    fuel: '',
    engine: '',
    power: '',
  };

  constructor(
    fb: FormBuilder,
    @Inject(DATA_PROVIDER_TOKEN) protected override readonly dataProvider: VehiclesFacade,
    private readonly _ns: NotificationService
  ) {
    super(fb, dataProvider);
  }

  public ngOnInit(): void {
    this.initGroupForm();
    this.initBase();
  }

  public save(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();

      this._ns.error('Completează toate câmpurile obligatorii.', {
        title: 'Formular invalid',
        durationMs: 4000
      });
      return;
    }

    this.saveData().pipe(
      tap(() => {
        this._ns.success('Vehiculul a fost salvat cu succes.', {
          title: 'Create Vehicle',
          durationMs: 4000
        });

        this.formGroup.reset();
        this.onReset();
        this.fetchData();
      }),
      catchError((err: HttpErrorResponse) => {
        this._ns.error(
          err?.error?.message ?? 'Nu am putut salva vehiculul. Eroare de server.',
          {
            title: 'Create Vehicle',
            durationMs: 4000
          }
        );
        return throwError(() => err);
      })
    ).subscribe();
  }

  public onSearch(): void {
    this.currentPage = 1;
    this.fetchData();
  }

  public onReset(): void {
    this.filters = {
      page: '1',
      brand: '',
      model: '',
      fuel: '',
      engine: '',
      power: '',
    };

    this.currentPage = 1;
    this.fetchData();
  }

  public prevPage(): void {
    if (this.currentPage <= 1 || this.isLoading) {
      return;
    }

    this.currentPage--;
    this.fetchData();
  }

  public nextPage(): void {
    if (this.currentPage >= this.totalPages || this.isLoading) {
      return;
    }

    this.currentPage++;
    this.fetchData();
  }

  public deleteVehicleById(id?: string): void {
    if (!id?.trim()) {
      this._ns.error('ID-ul vehiculului lipsește.', {
        title: 'Delete Vehicle',
        durationMs: 4000
      });
      return;
    }

    this.dataProvider.deleteData(id).subscribe({
      next: () => {
        this._ns.success('Vehiculul a fost șters cu succes.', {
          title: 'Delete Vehicle',
          durationMs: 4000
        });

        this.fetchData();
      },
      error: (err: HttpErrorResponse) => {
        this._ns.error(
          err?.error?.message ?? 'Nu am putut șterge vehiculul.',
          {
            title: 'Delete Vehicle',
            durationMs: 4000
          }
        );
      }
    });
  }

  protected initFilters(): void {
    this.fetchData();
  }

  protected initSubscription(): void {
    this.dataProvider.vehicles$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: VehiclesFetchDataModel | null) => {
        if (res) {
          this.vehicles = res.items ?? [];
          this.totalItems = res.totalItems ?? 0;
          this.totalPages = res.totalPages ?? 0;
          this.pageSize = res.pageSize ?? 0;
          this.currentPage = res.page ?? this.currentPage;
        } else {
          this.vehicles = [];
          this.totalItems = 0;
          this.totalPages = 0;
          this.pageSize = 0;
        }

        this.isLoading = false;
      });

    this.dataProvider.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.isLoading = loading;
      });
  }

  protected initGroupForm(): void {
    this.formGroup = this._fb.group({
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      fuel: ['', [Validators.required]],
      engine: ['', [Validators.required]],
      power: ['', [Validators.required]],
    });
  }

  protected fetchData(): void {
    this.dataProvider.fetchData({
      ...this.filters,
      page: String(this.currentPage),
    });
  }
}
