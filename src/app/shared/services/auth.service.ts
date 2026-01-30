import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {LocalStorageService} from './local-server.service';
import {AuthToken, LoginRequest, LoginResponse, LS_TOKEN_KEY} from '../interfaces/auth.model';
import {NotificationService} from './notification.service';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token$: BehaviorSubject<string | null>;
  public readonly token$: Observable<string | null>;

  constructor(
    private readonly _http: HttpClient,
    private readonly _storage: LocalStorageService,
    private readonly notificationService: NotificationService
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

  public login(payload: LoginRequest): Observable<LoginResponse> {
    return this._http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap((res: LoginResponse) => {
          const token = res?.token;
          if (!token) return;
          this.setToken(token);
        }),
    catchError((err: HttpErrorResponse) => {
      const message = this.notificationService.getLoginErrorMessage(err);
      this.notificationService.error(message, { title: 'Login', durationMs: 4000 });

      return throwError(() => err);
    })
      );
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
