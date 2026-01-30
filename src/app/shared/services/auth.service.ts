import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {LocalStorageService} from './local-server.service';
import {AuthToken, LoginRequest, LoginResponse, LS_TOKEN_KEY} from '../interfaces/auth.model';
import {NotificationService} from './notification.service';
import {NavigationService} from './router-service';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token$: BehaviorSubject<string | null>;
  public readonly token$: Observable<string | null>;

  constructor(
    private readonly _http: HttpClient,
    private readonly _storage: LocalStorageService,
    private readonly _notificationService: NotificationService,
    private readonly _navigationService: NavigationService
  ) {
    const initialToken = this._storage.get<string | null>(LS_TOKEN_KEY, null);
    this._token$ = new BehaviorSubject<string | null>(initialToken);
    this.token$ = this._token$.asObservable();
  }

  public get token(): AuthToken | null {
    return this._token$.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.token;
  }

  public login(payload: LoginRequest): void {
     this._http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap((res: LoginResponse) => {
          const token = res?.token;
          if (!token) return;
          this.setToken(token);
          this._navigationService.goToAdmin();
          this._notificationService.success('Success', { title: 'Login', durationMs: 4000 })
        }),
    catchError((err: HttpErrorResponse) => {
      const message: string = this._notificationService.getLoginErrorMessage(err);
      this._notificationService.error(message, { title: 'Login', durationMs: 4000 });

      return throwError(() => err);
    })
   ).subscribe();
  }

  public logout(): void {
    this.clearToken();
  }

  public setToken(token: AuthToken): void {
    this._token$.next(token);
    this._storage.set(LS_TOKEN_KEY, token);
  }

  public clearToken(): void {
    this._token$.next(null);
    this._storage.remove(LS_TOKEN_KEY);
  }
}
