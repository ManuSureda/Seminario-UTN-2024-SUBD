import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ITransport } from '../login/interfaces/i-transport';
import { HttpClient } from '@angular/common/http';
import { ISignUpCredentials } from '../login/interfaces/i-sign-up-credentials';
import { envConfig } from 'src/app/config/envConfig';
import { IResponse } from '../login/interfaces/i-response';
import { IResendConfirmationCodeCredentials } from '../login/interfaces/i-resend-confirmation-code-credentials';
import { IConfirmationCodeCredentials } from '../login/interfaces/i-confirmation-code-credentials';
import { ISignInCredentials } from '../login/interfaces/i-sign-in-credentials';
import { ISignInResponse } from '../login/interfaces/i-sign-in-response';
import { Storage } from '@capacitor/storage';
import { TransportService } from './transport.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  expressApi: string = envConfig.EXPRESS_API;

  constructor(
    private http : HttpClient,
    private transportService : TransportService
  ) { }

  // -- sign-up
  async signUp(signupCredentials: ISignUpCredentials): Promise<IResponse> {
    console.log("LoginService: signup()");
    
    return lastValueFrom(this.http.post<IResponse>(this.expressApi + 'auth/transports/sign-up', signupCredentials));
  }

  async reSendConfirmationCode(reSendConfirmationCodeCredentials: IResendConfirmationCodeCredentials): Promise<IResponse> {
    return lastValueFrom(this.http.post<IResponse>(this.expressApi + 'auth/transports/resend', reSendConfirmationCodeCredentials));
  }

  async sendConfirmationCode(confirmationCodeCredentials: IConfirmationCodeCredentials): Promise<IResponse> {
    return lastValueFrom(this.http.post<IResponse>(this.expressApi + 'auth/transports/confirm', confirmationCodeCredentials))
  }

  // -- sign-in
  async signIn(signinCredential: ISignInCredentials) {
    try {
      const response = await lastValueFrom(this.http.post<ISignInResponse>(this.expressApi + 'auth/transports/sign-in', signinCredential));
      console.log(response);
      
      if (response.access_token === undefined || response.access_token === null || response.access_token === '') {
        throw new Error("Algo salio mal al intentar iniciar secion, por favor intentelo mas tarde");
      }

      // para el interceptor:
      localStorage.setItem('token', response.access_token);
      // por si cerramos la app: (luego carga el localStorage en app.component.ts)
      await Storage.set({
        key: 'token',
        value: response.access_token
      })

      await this.transportService.fetchTransportByLicensePlate(signinCredential.licensePlate);
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    localStorage.clear();
    await Storage.clear();
  }
}
