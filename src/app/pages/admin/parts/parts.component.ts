import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ordersListComponent} from '../../../components/commands-list/orders-list.component';
import {NotificationService} from '../../../shared/services/notification.service';
import {catchError, takeUntil, tap, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {DropdownComponent} from '../../../components/dropdown/dropdown.component';
import {AsyncPipe} from '@angular/common';
import {PartsFacade} from '../../../shared/services/admin/parts/facade/parts-facade.service';
import {DATA_PROVIDER_TOKEN} from '../../../shared/services/admin/const/data-provider-token';
import {DataProviderModel} from '../../../shared/services/admin/model/data-provider-facade.model';
import {PartsDTO} from '../../../shared/services/admin/parts/models/partsDTO';
import {PartsState} from '../../../shared/services/admin/parts/models/part-state-model';
import {PartArgs} from '../../../shared/services/admin/parts/models/part-filters-model';
import {AdminCrudActionsBase} from '../models/admin-crud-actions';

@Component({
  selector: 'app-parts',
  imports: [
    ReactiveFormsModule,
    ordersListComponent,
    DropdownComponent,
    AsyncPipe,
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
  public sections: string[] = [];
  public subsections: string[] = [];
  public titles: string[] = [];
  private section: string = '';
  private subsection: string = '';
  private title: string = '';

  constructor(
    fb: FormBuilder,
    @Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProviderModel<PartsDTO, PartArgs, PartsState>,
    private readonly _ns: NotificationService
  ) {
    super(fb, dataProvider);
  }

  ngOnInit(): void {
    this.initBase();
  }

  public save(): void {
    this.saveData().pipe(
      tap(() => {
        this._ns.success('Success', { title: 'Create Part', durationMs: 4000 });
        this.initFilters();
      }),
      catchError((err: HttpErrorResponse) => {
        this._ns.error('Nu am putut salva produsul. Eroare de server.', { title: 'Vehicle', durationMs: 4000 });
        return throwError(() => err);
      })
    ).subscribe();
  }

  public sectionSelected(section: string) {
    if(section) {
      this.dataProvider.fetchData(section);
    } else {
      this.initFilters();
    }
    this.section = section;
  }

  public subsectionSelected(subsection: string) {
    if(subsection && this.section) {
      this.dataProvider.fetchData(this.section, subsection);
    } else if(this.section) {
      this.dataProvider.fetchData(this.section);
    }
    this.subsection = subsection;
  }

  public titleSelected(title: string) {
    this.title = title;
  }

  public deleteByFilters(): void {
   this.dataProvider.deleteData({
     section: this.section,
     subsection: this.subsection,
     title: this.title
   }).subscribe(
     (res: any) => {
       //todo
       this._ns.success('Success', { title: 'Delete Part', durationMs: 4000 });
     }
   )
  }

  protected initFilters(): void {
    this.dataProvider.fetchData();
  }

  protected initSubscription(): void {
    this.dataProvider.sectionFiltersPage$.pipe(takeUntil(this.destroy$)).subscribe((sections: string[] | null) => this.sections = sections ?? []);
    this.dataProvider.subsectionFiltersPage$.pipe(takeUntil(this.destroy$)).subscribe((subsections: string[] | null) => this.subsections = subsections ?? []);
    this.dataProvider.titleFiltersPage$.pipe(takeUntil(this.destroy$)).subscribe((titles: string[] | null) => this.titles = titles ?? []);
   }

  protected initGroupForm(): void {
    this.formGroup = this._fb.group({
      section: ['', [Validators.required]],
      subsection: ['', [Validators.required]],
      title: ['', [Validators.required]],
    });
  }
}
