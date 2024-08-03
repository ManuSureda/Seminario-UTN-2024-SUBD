import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { envConfig } from 'src/app/config/envConfig';
import { IPaymentData } from '../home/interfaces/i-payment-data';
import { lastValueFrom } from 'rxjs';
import { IDepositResponse } from '../home/interfaces/i-deposit-response';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private expressApi = envConfig.EXPRESS_API + 'payments';
  
  constructor(private http : HttpClient) { }

  async mpDeposit(paymentData : IPaymentData) {
    return lastValueFrom(this.http.post<IDepositResponse>(`${this.expressApi}/mp/deposit`, paymentData));
  }
}
