import {Component, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  template: '',
  standalone: true
})
export abstract class AdminCrudActionsBase<T> implements OnDestroy{
  protected readonly destroy$ = new Subject<void>();
  public formGroup!: FormGroup;
  public selectedTab: number = 2;

  protected constructor(protected readonly _fb: FormBuilder) {}

  protected abstract initSubscription(): void;
  protected abstract initGroupForm(): void;
  protected abstract initFilters(): void;

  protected initBase(): void {
    this.initSubscription();
    this.initGroupForm();
    this.initFilters();
  }

  public selectTab(tab: number): void {
    this.selectedTab = tab;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
