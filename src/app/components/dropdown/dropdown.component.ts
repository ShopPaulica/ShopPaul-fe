import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
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
    <div class="dropdown" [class.dropdown--open]="isOpen" [class.dropdown--disabled]="disabled">
      <button
        type="button"
        class="dropdown__trigger"
        (click)="toggle()"
        [disabled]="disabled"
      >
        <span
          class="dropdown__label"
          [class.dropdown__label--placeholder]="!selectedItem"
        >
          {{ selectedItem || placeholder }}
        </span>

        <span class="dropdown__arrow" [class.dropdown__arrow--open]="isOpen">
          ▾
        </span>
      </button>

      <div class="dropdown__panel" *ngIf="isOpen && !disabled">
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
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .filters-section {
      position: relative;
      z-index: 500;
    }

    * {
      box-sizing: border-box;
    }

    .dropdown {
      position: relative;
      width: 100%;
    }

    .dropdown__trigger {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      min-height: 54px;
      padding: 0 16px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(180deg, rgba(31, 32, 36, 0.98) 0%, rgba(35, 36, 41, 0.98) 100%);
      color: #ffffff;
      cursor: pointer;
      transition:
        border-color 160ms ease,
        background-color 160ms ease,
        box-shadow 160ms ease,
        transform 160ms ease;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.03),
        0 6px 16px rgba(0, 0, 0, 0.18);
    }

    .dropdown__trigger:hover:not(:disabled) {
      border-color: rgba(255, 147, 31, 0.26);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.03),
        0 10px 22px rgba(0, 0, 0, 0.22);
    }

    .dropdown--open .dropdown__trigger {
      border-color: rgba(255, 147, 31, 0.55);
      box-shadow:
        0 0 0 4px rgba(255, 122, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.03),
        0 10px 22px rgba(0, 0, 0, 0.22);
    }

    .dropdown__trigger:disabled {
      cursor: not-allowed;
      opacity: 0.55;
      background:
        linear-gradient(180deg, rgba(50, 51, 56, 0.95) 0%, rgba(44, 45, 49, 0.95) 100%);
      color: rgba(255, 255, 255, 0.5);
      box-shadow: none;
    }

    .dropdown__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      font-size: 15px;
      font-weight: 600;
      color: #ffffff;
    }

    .dropdown__label--placeholder {
      color: rgba(255, 255, 255, 0.45);
      font-weight: 500;
    }

    .dropdown__arrow {
      flex-shrink: 0;
      font-size: 16px;
      line-height: 1;
      color: rgba(255, 255, 255, 0.78);
      transition: transform 160ms ease;
    }

    .dropdown__arrow--open {
      transform: rotate(180deg);
    }

    .dropdown__panel {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      width: 100%;
      padding: 8px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background:
        linear-gradient(180deg, rgba(31, 32, 36, 0.99) 0%, rgba(35, 36, 41, 0.99) 100%);
      box-shadow:
        0 20px 40px rgba(0, 0, 0, 0.34),
        0 0 0 1px rgba(255, 122, 0, 0.04);
      z-index: 1000;
      max-height: 280px;
      overflow: auto;
      backdrop-filter: blur(10px);
    }

    .dropdown__panel::-webkit-scrollbar {
      width: 8px;
    }

    .dropdown__panel::-webkit-scrollbar-thumb {
      background: rgba(255, 147, 31, 0.45);
      border-radius: 999px;
    }

    .dropdown__item {
      width: 100%;
      display: block;
      text-align: left;
      padding: 12px 14px;
      border: 0;
      background: transparent;
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.88);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition:
        background-color 140ms ease,
        color 140ms ease,
        transform 140ms ease;
    }

    .dropdown__item:hover {
      background: rgba(255, 122, 0, 0.12);
      color: #ffffff;
    }

    .dropdown__item.is-selected {
      background: linear-gradient(135deg, rgba(255, 122, 0, 0.18) 0%, rgba(255, 147, 31, 0.14) 100%);
      color: #ffffff;
      font-weight: 700;
    }

    .dropdown__clear {
      margin-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 14px;
      color: #ffb15c;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      .dropdown__trigger {
        min-height: 50px;
        padding: 0 14px;
        border-radius: 14px;
      }

      .dropdown__panel {
        border-radius: 14px;
      }
    }

    @media (max-width: 420px) {
      .dropdown__trigger {
        min-height: 46px;
        padding: 0 12px;
        border-radius: 12px;
      }

      .dropdown__label {
        font-size: 14px;
      }

      .dropdown__item {
        padding: 11px 12px;
        font-size: 13px;
      }
    }
  `]
})
export class DropdownComponent {
  @Input() items: string[] = [];
  @Input() selectedItem: string | null = null;
  @Input() placeholder = 'Select...';
  @Input() allowClear = false;
  @Input() disabled = false;

  @Output() selectedItemChange = new EventEmitter<string>();

  isOpen = false;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  toggle(): void {
    if (this.disabled) {
      return;
    }

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isOpen = false;
  }
}
