import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthTokenInterceptor<T> implements HttpInterceptor {
  constructor(private readonly auth: AuthService) {}

  intercept(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | null = this.auth.token;

    if (!token) return next.handle(req);

    if (req.url.includes('/auth/login')) return next.handle(req);

    const authReq: HttpRequest<T> = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });

    return next.handle(authReq);
  }
}
