import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dropdown">
      <button
        type="button"
        class="dropdown__trigger"
        (click)="toggle()"
      >
        <span class="dropdown__label">
          {{ selectedItem ?? placeholder }}
        </span>
        <span>▾</span>
      </button>

      <div class="dropdown__panel" *ngIf="isOpen">
        <button
          type="button"
          class="dropdown__item"
          *ngFor="let item of items; trackBy: trackByValue"
          [class.is-selected]="item === selectedItem"
          (click)="select(item)"
        >
          {{ item }}
        </button>

        <button
          *ngIf="allowClear && selectedItem"
          type="button"
          class="dropdown__item dropdown__clear"
          (click)="clear()"
        >
          Clear
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dropdown { position: relative; display: inline-block; width: 100%;}
    .dropdown__trigger {

      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 5px;
      border-radius: 4px;
      border: 2px solid rgba(0, 0, 0, 0.18);
      background: #fff;
      cursor: pointer;
    }
    .dropdown__panel {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      width: 100%;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      padding: 6px;
      z-index: 1000;
      max-height: 260px;
      overflow: auto;
    }
    .dropdown__item {
      width: 100%;
      text-align: left;
      padding: 10px;
      border: 0;
      background: transparent;
      border-radius: 8px;
      cursor: pointer;
    }
    .dropdown__item:hover { background: #f3f3f3; }
    .dropdown__item.is-selected { background: #e9f2ff; }
  `]
})
export class DropdownComponent {

  @Input() items: string[] = [];

  /** Preselect */
  @Input() selectedItem: string | null = null;

  @Input() placeholder = 'Select...';

  @Input() allowClear = false;

  /** Pentru [(selectedItem)] */
  @Output() selectedItemChange = new EventEmitter<string>();

  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  select(item: string): void {
    this.selectedItem = item;
    this.selectedItemChange.emit(item);
    this.isOpen = false;
  }

  clear(): void {
    this.selectedItem = null;
    this.selectedItemChange.emit('');
    this.isOpen = false;
  }

  trackByValue = (_: number, item: string) => item;
}
