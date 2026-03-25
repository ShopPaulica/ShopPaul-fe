import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
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

  public isEditModalOpen = false;
  public editingPartId = '';
  public editForm!: FormGroup;

  constructor(
    fb: FormBuilder,
    @Inject(DATA_PROVIDER_TOKEN) protected override readonly dataProvider: PartsFacade,
    private readonly _ns: NotificationService
  ) {
    super(fb, dataProvider);
  }

  public ngOnInit(): void {
    this.initGroupForm();
    this.initEditForm();
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

        this.formGroup.reset({
          section: '',
          subsection: '',
          title: '',
          order: 0,
        });

        this.currentPage = 1;
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

  public openEditModal(part: PartsDTO): void {
    this.editingPartId = part.id || '';
    this.isEditModalOpen = true;

    this.editForm.reset({
      section: part.section || '',
      subsection: part.subsection || '',
      title: part.title || '',
      order: part.order ?? 0,
    });
  }

  public closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingPartId = '';
    this.editForm.reset({
      section: '',
      subsection: '',
      title: '',
      order: 0,
    });
  }

  public saveEdit(): void {
    if (!this.editingPartId.trim()) {
      this._ns.error('Lipsește ID-ul part-ului.', {
        title: 'Edit Part',
        durationMs: 4000
      });
      return;
    }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this._ns.error('Completează toate câmpurile obligatorii.', {
        title: 'Edit Part',
        durationMs: 4000
      });
      return;
    }

    const raw = this.editForm.getRawValue();

    this.isLoading = true;

    this.dataProvider.updateData(this.editingPartId, {
      section: raw.section?.trim() || '',
      subsection: raw.subsection?.trim() || '',
      title: raw.title?.trim() || '',
    }).subscribe({
      next: () => {
        this._ns.success('Part-ul a fost modificat cu succes.', {
          title: 'Edit Part',
          durationMs: 4000
        });

        this.closeEditModal();
        this.fetchData();
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this._ns.error(
          err?.error?.message ?? 'Nu am putut modifica part-ul.',
          {
            title: 'Edit Part',
            durationMs: 4000
          }
        );
      }
    });
  }

  public onSearch(): void {
    this.currentPage = 1;
    this.fetchData();
  }

  public onResetDeleteFilters(): void {
    this.formGroup.reset({
      section: '',
      subsection: '',
      title: '',
      order: 0,
    });

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
    this.fetchData();
  }

  protected initSubscription(): void {
    this.dataProvider.parts$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: PartFetchDataModel | null) => {
        if (res) {
          this.parts = res.items ?? [];
          this.totalItems = res.totalItems ?? 0;
          this.totalPages = res.totalPages ?? 0;
          this.pageSize = res.pageSize ?? 0;
          this.currentPage = res.page ?? this.currentPage;
        } else {
          this.parts = [];
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
      section: ['', [Validators.required]],
      subsection: ['', [Validators.required]],
      title: ['', [Validators.required]],
      order: [0],
    });
  }

  private initEditForm(): void {
    this.editForm = this._fb.group({
      section: ['', [Validators.required]],
      subsection: ['', [Validators.required]],
      title: ['', [Validators.required]],
      order: [0],
    });
  }

  protected fetchData(): void {
    const raw = this.formGroup.getRawValue();

    this.dataProvider.fetchData({
      section: raw.section?.trim() || '',
      subsection: raw.subsection?.trim() || '',
      title: raw.title?.trim() || '',
      page: String(this.currentPage),
    });
  }
}
