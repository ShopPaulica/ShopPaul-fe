import { Directive, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataProviderModel } from '../../../shared/services/admin/model/data-provider-facade.model';
import { ApiItemResponse } from '../../../shared/interfaces/api/api-respons';

@Directive()
export abstract class AdminCrudActionsBase<
  TItem,
  TArgs extends unknown[],
  TState extends object
> implements OnDestroy {
  protected readonly destroy$ = new Subject<void>();

  public formGroup!: FormGroup;
  public selectedTab = 2;
  public isLoading = false;
  public currentPage = 1;
  public totalPages = 1;
  public totalItems = 0;
  public pageSize = 30;

  protected constructor(
    protected readonly _fb: FormBuilder,
    protected readonly dataProvider: DataProviderModel<TItem, TArgs, TState, string>
  ) {}

  protected abstract initSubscription(): void;
  protected abstract fetchData(): void;

  protected initBase(): void {
    this.isLoading = true;
    this.initSubscription();
    this.fetchData();
  }

  public refreshData(): void {
    this.fetchData();
    this.isLoading = true;
  }


  public saveData(): Observable<ApiItemResponse<TItem>> {
    return this.dataProvider.saveData(this.formGroup.getRawValue());
  }

  public selectTab(tab: number): void {
    this.selectedTab = tab;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
