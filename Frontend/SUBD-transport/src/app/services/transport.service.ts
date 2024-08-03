import { Injectable } from '@angular/core';
import { envConfig } from '../config/envConfig';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@capacitor/storage';
import { ITransport } from '../login/interfaces/i-transport';
import { lastValueFrom } from 'rxjs';
import { IUpdateRouteNumber } from '../login/interfaces/i-update-route-number';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  expressApi: string = envConfig.EXPRESS_API;

  constructor(private http: HttpClient) { }

  async fetchTransportByLicensePlate(licensePlate : string) {
    console.log("TransportService fetchTransportByLicensePlate");
    
    try {
      const transportResult: ITransport = await lastValueFrom(this.http.get<ITransport>(`${this.expressApi}transports/`,
        { 
          params: { licensePlate } 
        }
      ));
      
      if (transportResult.licensePlate === undefined || transportResult.licensePlate === null) {
        throw new Error('Error al tomar la informacion del transporte, por favor contacte con un administrador');
      }

      console.log("fetchTRANSPORT -------------------------------AAAAAAAAAAAAAAAAAA");
      console.log(transportResult);      
      console.log("fetchTRANSPORT -------------------------------AAAAAAAAAAAAAAAAAA");      

      await Storage.set({
        key: 'transport',
        value: JSON.stringify(transportResult)
      })
    } catch (error) {
      console.log(error);  
      throw error;
    }
  }

  async updateRouteNumber(updateCredentials : IUpdateRouteNumber) {
    try {
      const transportResult: ITransport = await lastValueFrom(this.http.put<ITransport>(`${this.expressApi}transports/update`,
        updateCredentials
      ));

      if (transportResult == null) {
        throw new Error('Error al actualizar la informacion del transporte, por favor contacte con un administrador');
      }
      
      if (transportResult.licensePlate === undefined || transportResult.licensePlate === null) {
        throw new Error('Error al tomar la informacion del transporte, por favor contacte con un administrador');
      }

      console.log("fetchTRANSPORT -------------------------------AAAAAAAAAAAAAAAAAA");
      console.log(transportResult);      
      console.log("fetchTRANSPORT -------------------------------AAAAAAAAAAAAAAAAAA");      

      await Storage.set({
        key: 'transport',
        value: JSON.stringify(transportResult)
      })
    } catch (error) {
      console.log(error);  
      throw error;
    }
  }
}
