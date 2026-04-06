import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PayuInitDTO } from './payu-init-dto';
import { ApiItemResponse } from '../../../interfaces/api/api-respons';
import { PayuInitResponseItem } from './payu-init-response-item';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PayuApiService {
  constructor(private readonly _http: HttpClient) {}

  public initPayment(payload: PayuInitDTO): Observable<ApiItemResponse<PayuInitResponseItem>> {
    return this._http.post<ApiItemResponse<PayuInitResponseItem>>(
      `${environment.apiUrl}/payment-payu/init`,
      {
        firstName: payload.firstName?.trim() || '',
        lastName: payload.lastName?.trim() || '',
        email: payload.email?.trim() || '',
        mobile: payload.mobile?.trim() || '',
        amount: Number(payload.amount || 0),
        productInfo: payload.productInfo?.trim() || '',
        city: payload.city?.trim() || '',
        county: payload.county?.trim() || '',
        street: payload.street?.trim() || '',
        streetNumber: payload.streetNumber?.trim() || '',
      }
    );
  }

  public getPaymentByTxnId(txnId: string): Observable<ApiItemResponse<PayuInitResponseItem>> {
    return this._http.get<ApiItemResponse<PayuInitResponseItem>>(
      `${environment.apiUrl}/payment-payu/${txnId}`
    );
  }

  public redirectToPayU(redirectUri: string): void {
    window.location.href = redirectUri;
  }
}
