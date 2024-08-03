import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { envConfig } from 'src/app/config/envConfig';
import { ITravel } from '../home/interfaces/i-travel';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class TravelService {
  expressApi: string = envConfig.EXPRESS_API;

  constructor(private http : HttpClient) { }

  async fetchTravelListByUserEmail(userEmail : string) {
    try {
      const result: [ITravel] = await lastValueFrom(this.http.get<[ITravel]>(`${this.expressApi}travels/`,
        { params: { userEmail } }
      ));      
      
      // console.log("fetchTRAVEL -------------------------------AAAAAAAAAAAAAAAAAA");
      // console.log(result);      
      // console.log("fetchTRAVEL -------------------------------AAAAAAAAAAAAAAAAAA");

      await Storage.set({
        key: 'travels',
        value: JSON.stringify(result.reverse())
      })
      return result.length;
    } catch (error) {
      throw error;
    }
  }
}
