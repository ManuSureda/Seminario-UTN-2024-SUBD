import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { envConfig } from 'src/app/config/envConfig';
import { IUser } from '../home/interfaces/i-user';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private expressApi = envConfig.EXPRESS_API;
  
  constructor(private http: HttpClient) { }

  async fetchUserByEmail(userEmail : string) {
    try {
      
      const result: IUser = await lastValueFrom(this.http.get<IUser>(`${this.expressApi}users/`,
        { params: { userEmail } }
      ));      
      
      // El problema es que en JavaScript y TypeScript, el valor 0 es considerado falsy. Por lo tanto, !result.balance será true si result.balance es 0. Para evitar este problema, se debe verificar específicamente si result.balance es null o undefined, en lugar de verificarlo de manera general.
      // if (!result.userEmail || !result.balance || !result.name || !result.lastName) {
      //   throw new Error('Error al tomar la informacion de su cuenta, por favor contacte con un administrador');
      // }
      
      if (result.balance === undefined || result.balance === null) {
        throw new Error('Error al tomar la informacion de su cuenta, por favor contacte con un administrador');
      }
      if (!result.userEmail || !result.name || !result.lastName) {
        throw new Error('Error al tomar la informacion de su cuenta, por favor contacte con un administrador');
      }
      // console.log("fetchUSER -------------------------------AAAAAAAAAAAAAAAAAA");
      // console.log(result);      
      // console.log("fetchUSER -------------------------------AAAAAAAAAAAAAAAAAA");      

      await Storage.set({
        key: 'user',
        value: JSON.stringify(result)
      })
    } catch (error) {  
      throw error;
    }
  }

}
