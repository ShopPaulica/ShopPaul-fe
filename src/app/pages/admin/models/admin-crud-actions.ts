import {Directive, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataProviderModel} from '../../../shared/services/admin/model/data-provider-facade.model';
import {ApiItemResponse} from '../../../shared/interfaces/api/api-respons';

@Directive()
export abstract class AdminCrudActionsBase<TItem, TArgs extends unknown[], TState extends object>
  implements OnDestroy {

  protected readonly destroy$ = new Subject<void>();
  public formGroup!: FormGroup;
  public selectedTab: number = 2;

  protected constructor(
    protected readonly _fb: FormBuilder,
    protected readonly dataProvider: DataProviderModel<TItem, TArgs, TState>
  ) {}

  protected abstract initSubscription(): void;
  protected abstract initGroupForm(): void;
  protected abstract initFilters(): void;
  public abstract deleteByFilters(): void;

  protected initBase(): void {
    this.initSubscription();
    this.initGroupForm();
    this.initFilters();
  }

  public saveData(): Observable<ApiItemResponse<TItem>> {
    return this.dataProvider.saveData(this.formGroup.getRawValue());
  }

  public selectTab(tab: number): void {
    this.selectedTab = tab;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
