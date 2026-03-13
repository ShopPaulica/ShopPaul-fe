import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, takeUntil, tap, throwError } from 'rxjs';

import { NotificationService } from '../../../shared/services/notification.service';
import { PartsFacade } from '../../../shared/services/admin/parts/facade/parts-facade.service';
import { DATA_PROVIDER_TOKEN } from '../../../shared/services/admin/const/data-provider-token';
import { PartsDTO } from '../../../shared/services/admin/parts/models/partsDTO';
import { PartsState } from '../../../shared/services/admin/parts/models/part-state-model';
import { PartArgs } from '../../../shared/services/admin/parts/models/part-filters-model';
import { AdminCrudActionsBase } from '../models/admin-crud-actions';
import { PartFetchDataModel } from '../../../shared/services/admin/parts/models/parts-fetch-data.model';

@Component({
  selector: 'app-parts',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
  ],
  providers: [
    {
      provide: DATA_PROVIDER_TOKEN,
      useExisting: PartsFacade,
    }
  ],
  templateUrl: './parts.component.html',
  standalone: true,
  styleUrl: './parts.component.scss'
})
export class PartsComponent extends AdminCrudActionsBase<PartsDTO, PartArgs, PartsState> implements OnInit {
  public parts: PartsDTO[] = [];

  public filters: {
    section: string;
    subsection: string;
    title: string;
  } = {
    section: '',
    subsection: '',
    title: '',
  };

  constructor(
    fb: FormBuilder,
    @Inject(DATA_PROVIDER_TOKEN) protected override readonly dataProvider: PartsFacade,
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
        this._ns.success('Part-ul a fost salvat cu succes.', {
          title: 'Create Part',
          durationMs: 4000
        });

        this.formGroup.reset();
        this.onResetDeleteFilters();
        this.fetchData();
      }),
      catchError((err: HttpErrorResponse) => {
        this._ns.error(
          err?.error?.message ?? 'Nu am putut salva part-ul. Eroare de server.',
          {
            title: 'Create Part',
            durationMs: 4000
          }
        );
        return throwError(() => err);
      })
    ).subscribe();
  }

  public onTitleChange(): void {
    this.filters.title = this.filters.title.trimStart();
  }

  public onResetDeleteFilters(): void {
    this.filters = {
      section: '',
      subsection: '',
      title: '',
    };

    this.fetchData();
  }

  public deletePartById(id?: string): void {
    if (!id?.trim()) {
      this._ns.error('ID-ul part-ului lipsește.', {
        title: 'Delete Part',
        durationMs: 4000
      });
      return;
    }

    this.dataProvider.deleteData(id).subscribe({
      next: () => {
        this._ns.success('Part-ul a fost șters cu succes.', {
          title: 'Delete Part',
          durationMs: 4000
        });

        this.fetchData();
      },
      error: (err: HttpErrorResponse) => {
        this._ns.error(
          err?.error?.message ?? 'Nu am putut șterge part-ul.',
          {
            title: 'Delete Part',
            durationMs: 4000
          }
        );
      }
    });
  }

  protected initFilters(): void {
    this.dataProvider.fetchData(
      this.filters.section,
      this.filters.subsection,
      this.filters.title
    );
  }

  protected initSubscription(): void {
    this.dataProvider.parts$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: PartFetchDataModel | null) => {
        if (res) {
          this.parts = res.items ?? [];
          this.totalItems = res.totalItems;
          this.totalPages = res.totalPages;
          this.pageSize = res.pageSize;
        } else {
          this.parts = [];
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
      section: ['', [Validators.required]],
      subsection: ['', [Validators.required]],
      title: ['', [Validators.required]],
    });
  }

  protected fetchData(): void {
    this.dataProvider.fetchData(
      this.filters.section,
      this.filters.subsection,
      this.filters.title
    );
  }
}
