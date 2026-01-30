import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  message: string;
  title?: string;
  type: NotificationType;
  durationMs?: number;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _items$ = new BehaviorSubject<AppNotification[]>([]);
  public readonly items$ = this._items$.asObservable();

  show(input: Omit<AppNotification, 'id' | 'createdAt'>): string {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
    const item: AppNotification = { ...input, id, createdAt: Date.now() };

    this._items$.next([item, ...this._items$.value]);

    if (item.durationMs && item.durationMs > 0) {
      window.setTimeout(() => this.close(id), item.durationMs);
    }

    return id;
  }

  success(message: string, opts?: { title?: string; durationMs?: number }) {
    return this.show({ type: 'success', message, ...opts });
  }

  error(message: string, opts?: { title?: string; durationMs?: number }) {
    return this.show({ type: 'error', message, ...opts });
  }

  info(message: string, opts?: { title?: string; durationMs?: number }) {
    return this.show({ type: 'info', message, ...opts });
  }

  warning(message: string, opts?: { title?: string; durationMs?: number }) {
    return this.show({ type: 'warning', message, ...opts });
  }

  close(id: string): void {
    this._items$.next(this._items$.value.filter((x) => x.id !== id));
  }

  clear(): void {
    this._items$.next([]);
  }

  public getLoginErrorMessage(err: HttpErrorResponse): string {
      const apiMsg =
        (err.error && typeof err.error === 'object' && 'message' in err.error)
          ? String((err.error as any).message)
          : '';

      if (apiMsg) return apiMsg;

      if (err.status === 0) return 'Nu pot ajunge la server (CORS / server oprit).';
      if (err.status === 401) return 'Email sau parolă greșite.';
      if (err.status === 400) return 'Completează email și parolă.';


    return 'Eroare neașteptată la login.';
  }

}
