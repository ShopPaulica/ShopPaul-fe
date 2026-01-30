import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppNotification, NotificationService} from '../../shared/services/notification.service';

@Component({
  selector: 'app-notification-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toaster" aria-live="polite" aria-relevant="additions removals">
      <div
        class="toast"
        *ngFor="let n of (ns.items$ | async); trackBy: trackById"
        [class.success]="n.type === 'success'"
        [class.error]="n.type === 'error'"
        [class.info]="n.type === 'info'"
        [class.warning]="n.type === 'warning'"
        role="status"
      >
        <div class="toast__content">
          <div class="toast__title" *ngIf="n.title">{{ n.title }}</div>
          <div class="toast__message">{{ n.message }}</div>
        </div>

        <button
          class="toast__close"
          type="button"
          aria-label="Close notification"
          (click)="ns.close(n.id)"
        >
          ×
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toaster{
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      display: grid;
      gap: 10px;
      max-width: 360px;
    }

    .toast{
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: start;
      gap: 10px;

      padding: 12px 12px;
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.18);

      background: #111827;   /* neutral dark */
      color: #fff;
      border: 1px solid rgba(255,255,255,0.10);
    }

    .toast.success { border-color: rgba(34,197,94,0.35); }
    .toast.error   { border-color: rgba(239,68,68,0.35); }
    .toast.info    { border-color: rgba(59,130,246,0.35); }
    .toast.warning { border-color: rgba(245,158,11,0.35); }

    .toast__title{
      font-weight: 800;
      margin-bottom: 2px;
      line-height: 1.2;
    }

    .toast__message{
      opacity: 0.92;
      line-height: 1.35;
      word-break: break-word;
    }

    .toast__close{
      width: 34px;
      height: 34px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06);
      color: #fff;
      cursor: pointer;
      line-height: 1;
      font-size: 20px;
    }

    .toast__close:hover{
      background: rgba(255,255,255,0.10);
    }

    /* ✅ pe ecrane mici -> width 100% */
    @media (max-width: 600px){
      .toaster{
        left: 12px;
        right: 12px;
        max-width: none;
      }

      .toast{
        width: 100%;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationToasterComponent {
  constructor(public readonly ns: NotificationService) {}

  trackById(_: number, item: AppNotification) {
    return item.id;
  }
}
