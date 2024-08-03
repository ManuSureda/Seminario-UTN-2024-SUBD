import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ILocalidadesResponse, IMunicipiosResponse, IProvinciasResponse } from '../login/interfaces/georef-interfaces';
import { ISignUpCredentials } from '../login/interfaces/sign-up-credentials';
import { IResponse } from '../login/interfaces/i-response';
import { IConfirmationCodeCredentials } from '../login/interfaces/i-confirmation-code-credentials';
import { IResendConfirmationCodeCredentials } from '../login/interfaces/i-resend-confirmation-code-credentials';
import { ISignInCredentials } from '../login/interfaces/i-sign-in-credentials';
import { envConfig } from 'src/app/config/envConfig';
import { ISignInResponse } from '../login/interfaces/i-sign-in-response';
import { Storage } from '@capacitor/storage';
import { UserService } from './user.service';
import { TravelService } from './travel.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // token: string = '';
  // localUserEmail: string = '';
  // private userSubject = new BehaviorSubject<IUser | null>(null);
  // user$ = this.userSubject.asObservable();
  
  georefApi: string = 'https://apis.datos.gob.ar/georef/api/';
  expressApi: string = envConfig.EXPRESS_API;

  constructor(
    private http : HttpClient,
    private userService : UserService,
    private travelService : TravelService
  ) { }

  // -- sign-up
  async signUp(signupCredentials: ISignUpCredentials): Promise<IResponse> {
    return lastValueFrom(this.http.post<IResponse>(this.expressApi + 'auth/clients/sign-up', signupCredentials));
  }

  async reSendConfirmationCode(reSendConfirmationCodeCredentials: IResendConfirmationCodeCredentials): Promise<IResponse> {
    return lastValueFrom(this.http.post<IResponse>(this.expressApi + 'auth/clients/resend', reSendConfirmationCodeCredentials));
  }

  async sendConfirmationCode(confirmationCodeCredentials: IConfirmationCodeCredentials): Promise<IResponse> {
    return lastValueFrom(this.http.post<IResponse>(this.expressApi + 'auth/clients/confirm', confirmationCodeCredentials))
  }

  // -- sign-in
  async signIn(signinCredential: ISignInCredentials) {
    try {
      const response = await lastValueFrom(this.http.post<ISignInResponse>(this.expressApi + 'auth/clients/sign-in', signinCredential));
      if (response.access_token === undefined || response.access_token === null || response.access_token === '') {
        throw new Error("Algo salio mal al intentar iniciar secion, por favor intentelo mas tarde");
      }
      
      // interceptor:
      localStorage.setItem('token', response.access_token);
      // in case we close the app: (re loaded on app.component.ts)
      await Storage.set({
        key: 'token',
        value: response.access_token
      })
            
      await this.userService.fetchUserByEmail(signinCredential.userEmail);
      await this.travelService.fetchTravelListByUserEmail(signinCredential.userEmail);

      const travelsString = await Storage.get({key: 'travels'});
      const travel = travelsString.value == '' ? [] : JSON.parse(travelsString.value!);
      
      localStorage.setItem('localTravelsLength', travel.length)
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    localStorage.clear()
    sessionStorage.clear()
    Storage.clear()
  }

  // --------- localidades: -----------------
  async getProvinces(): Promise<IProvinciasResponse> {
    return lastValueFrom(this.http.get<IProvinciasResponse>(
      `${this.georefApi}provincias?orden=nombre&aplanar=true&campos=nombre&max=30&inicio=0&exacto=true`)
    );
  }

  async getMunicipios(provinciaId: string, inicio: number = 0): Promise<IMunicipiosResponse> {
    // return lastValueFrom(this.http.get<IMunicipiosResponse>(`${this.georefApi}municipios?provincia=${provinciaId}&inicio=${inicio}`));
    return lastValueFrom(this.http.get<IMunicipiosResponse>(
      `${this.georefApi}municipios?provincia=${provinciaId}&orden=nombre&aplanar=true&campos=nombre&max=300&inicio=0&exacto=true`)
    );
  }

  async getLocalidades(municipioId: string, inicio: number = 0): Promise<ILocalidadesResponse> {
    // return lastValueFrom(this.http.get<ILocalidadesResponse>(`${this.georefApi}localidades?municipio=${municipioId}&inicio=${inicio}`));
    return lastValueFrom(this.http.get<ILocalidadesResponse>(
      `${this.georefApi}localidades?municipio=${municipioId}&orden=nombre&aplanar=true&campos=nombre&max=200&inicio=0&exacto=true`)
    );
  }
  
}
