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
import {PartFetchDataModel} from '../../../shared/services/admin/parts/models/parts-fetch-data.model';

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
        this.initFilters();
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
  }

  public deleteByFilters(): void {
    const payload: Record<string, string> = {};

    if (this.filters.section.trim()) payload['section'] = this.filters.section.trim();
    if (this.filters.subsection.trim()) payload['subsection'] = this.filters.subsection.trim();
    if (this.filters.title.trim()) payload['title'] = this.filters.title.trim();

    if (!Object.keys(payload).length) {
      this._ns.error('Selectează cel puțin un filtru pentru ștergere.', {
        title: 'Delete Part',
        durationMs: 4000
      });
      return;
    }

    this.dataProvider.deleteData(payload as unknown as string).subscribe({
      next: () => {
        this._ns.success('Part-urile au fost șterse cu succes.', {
          title: 'Delete Part',
          durationMs: 4000
        });

        this.onResetDeleteFilters();
        this.initFilters();
      },
      error: (err: HttpErrorResponse) => {
        this._ns.error(
          err?.error?.message ?? 'Nu am putut șterge part-urile.',
          {
            title: 'Delete Part',
            durationMs: 4000
          }
        );
      }
    });
  }

  protected initFilters(): void {
    this.dataProvider.fetchData();
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
    this.initFilters();
  }
}
