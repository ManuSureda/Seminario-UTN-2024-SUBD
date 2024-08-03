import { Injectable } from '@angular/core';
import { envConfig } from 'src/app/config/envConfig';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ITicketDataPayment } from '../home/interfaces/i-ticket-data-payment';
import { Storage } from '@capacitor/storage';
import { ITicketGetOut, instanceOfITicketGetOut } from '../home/interfaces/i-ticket-get-out';
import { ILocalStorageTicket, instanceOfLocalStorageTicket } from '../home/interfaces/i-local-storage-ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  expressApi: string = envConfig.EXPRESS_API;

  constructor(
    private http : HttpClient
  ) { }

  async saveLocalGetInCopy(ticketData: ITicketDataPayment, isOnline: boolean) {
    console.log("saveLocalTravelCopy");  
    if (isOnline === false) {
      localStorage.setItem('unsavedDataFlag', "true");
    }  
    // copia local que sera leida en caso de que el usuario o invitado intente registrar un desenso 
    const data: ILocalStorageTicket = {
      isOnline: isOnline,
      onlinePayment: ticketData.onlinePayment,
      transportData: ticketData.transportData,
      clientData: ticketData.clientData
    }
    console.log(data);    
    
    if (!data.clientData.guestEmail && !data.clientData.guestDni) {
      // esto quiere decir que es el viaje del pagador
      await Storage.set({
        key: data.clientData.payerEmail,
        value: JSON.stringify(data)
      });      
    } else if (data.clientData.guestEmail) {
      // esto quiere decir que es el viaje de un invitado que tal vez, este registrado en la app      
      await Storage.set({
        key: data.clientData.guestEmail,
        value: JSON.stringify(data)
      });
    }
  }

  async sendGetInTicket(ticketData : ITicketDataPayment) {
    try {
      const resul = lastValueFrom(this.http.post(this.expressApi + 'travels/get-in', ticketData));
      console.log(resul);
      return resul    
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async saveLocalGetOutCopy(outData: ITicketGetOut) {
    console.log("saveLocalGetOutCopy");  
    
    // this function will execute only, if the connection to the server has failed 
    localStorage.setItem('unsavedDataFlag', "true");     
    
    const travelString = await Storage.get({ key: outData.userEmail });
    if (!travelString.value) {
      throw new Error('Ascenso no encontrado');
    }
    const localTravel: ILocalStorageTicket = JSON.parse(travelString.value);
    if (!instanceOfLocalStorageTicket(localTravel)) {
      throw new Error('Error al procesar su pasage, por favor intente de nuevo');
    }
    if (localTravel.getOutData && instanceOfITicketGetOut(localTravel.getOutData)) {
      throw new Error('Ya existe un descenso registrado para este viaje');
    }

    localTravel.getOutData = outData;

    await Storage.set({
      key: outData.userEmail,
      value: JSON.stringify(localTravel)
    });
  }

  async sendGetOutTicket(ticketData : ITicketGetOut) {
    try {
      if (!ticketData || !instanceOfITicketGetOut(ticketData)) {
        throw new Error('Error al cargar los datos del descenso, intente de nuevo');
      }

      const resul = lastValueFrom(this.http.post(this.expressApi + 'travels/get-out', ticketData));
      console.log(resul);
      return resul          
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  /**
   * this function will execute only, if the connection to the server has failed
   * during sendGetInTicket or sendGetOutTicket and there is local data that has 
   * not been sent to the server.
   * if the conecction is succesfull, then local data will be deleted otherwise
   * the function sleeps and then re try
   */
  async checkAndSendUnsavedData() {
    console.log('checkAndSendUnsavedData');
    
    // these means it is all ready runing
    if (localStorage.getItem('checkAndSendUnsavedData') === 'true') {
      return;
    } 

    try {
      localStorage.setItem('checkAndSendUnsavedData', 'true');
      // gets all of Ionic.Storage keys
      const keyList = await Storage.keys();
      // keeps only those how represents ILocalStorageTickets
      const emailKeys = keyList.keys.filter(key => key.includes('@'));

      for ( const key of emailKeys ) {
        console.log(key);
        let isOnlineFlag = false;
        const dataString = await Storage.get({ key: key });
        if (!dataString.value) {
          continue;
        }
        const data: ILocalStorageTicket = JSON.parse(dataString.value);
        if (!instanceOfLocalStorageTicket(data)) {
          continue;
        } 
        try {
          if (!data.isOnline) {
            // this means that the get-in data could't bee properly send to the server
            const ticket: ITicketDataPayment = {
              transportData: data.transportData,
              clientData:    data.clientData,
              onlinePayment: data.onlinePayment
            }
            await this.sendGetInTicket(ticket); 
            data.isOnline = true;
            await Storage.set({
              key: key,
              value: JSON.stringify(data)
            });
          }
          const getOutData = data.getOutData;
          if (getOutData && instanceOfITicketGetOut(getOutData)) {
            // if this is executed properly, then, there is no need to keep the local data stored
            await this.sendGetOutTicket(getOutData);
            await Storage.remove({ key: key });
          }
          // otherwise it's because the user has't atempt a get-out yet 
        } catch (error) {
          if (error instanceof HttpErrorResponse && error.status === 0) {
            // it means that we still have no connection to the server
            throw error;
          } else {
            // in this case, there is probably an error with data structure, so i consider to delete such record
            await Storage.remove({ key: key });
          }
        }
      }
      // if it reach this point without any error 
      localStorage.removeItem('unsavedDataFlag');
    } catch (error) {
      console.log(error);      
      return;
    } finally {
      localStorage.removeItem('checkAndSendUnsavedData');
    }
  }
}
