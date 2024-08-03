import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { ITransport } from 'src/app/login/interfaces/i-transport';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NFC } from '@awesome-cordova-plugins/nfc/ngx';

import { Geolocation } from '@capacitor/geolocation';
import { ITicketClientData } from '../../interfaces/i-ticket-client-data';
import { ITicketGetOut } from '../../interfaces/i-ticket-get-out';
import { ILocalStorageTicket, instanceOfLocalStorageTicket } from '../../interfaces/i-local-storage-ticket';
import { ITicketDataPayment } from '../../interfaces/i-ticket-data-payment';
import { ITicketTransportData } from '../../interfaces/i-ticket-transport-data';
import { TicketService } from 'src/app/services/ticket.service';
import { TransportService } from 'src/app/services/transport.service';


@Component({
  selector: 'app-nfc-reader',
  templateUrl: './nfc-reader.component.html',
  styleUrls: ['./nfc-reader.component.scss'],
})
export class NfcReaderComponent implements OnInit {
  transport: ITransport | null = null;
  selectedRouteOption = '';

  nfcIsEnabled: boolean = false;

  scannedResult: any = null;

  debugMsg: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private nfc: NFC,
    private ticketService: TicketService,
    private transportService: TransportService,
    private router: Router
  ) { }

  async ngOnInit() {
    console.log("NfcReaderComponent ngOnInit");
  }

  clearMessages() {
    this.debugMsg = '';
    this.successMessage = '';
    this.errorMessage = '';
  }

  catchErrorMessage(error: any) {
    console.log(error);
    if (error instanceof HttpErrorResponse) {
      this.errorMessage = error.error.message || error.message;
    } else if (error instanceof Error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = String(error);
    }
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 4000);
  }

  async loadTransport() {
    try {
      if (localStorage.getItem('refreshTransport')) {
        console.log('if refreshTransport');
        await this.transportService.fetchTransportByLicensePlate(this.transport?.licensePlate!);
        localStorage.removeItem('refreshTransport');
      }

      if (!this.transport) {
        console.log("if !transport");
        const transport = await Storage.get({ key: 'transport' });
        if (transport && typeof transport.value === "string") {
          this.transport = JSON.parse(transport.value);
        }
      }
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  async ionViewWillEnter() {
    console.log("NfcReaderComponent ionViewWillEnter");
    try {
      this.scannedResult = null;
      await this.initializeComponent();
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  async initializeComponent() {
    console.log("initialize - NfcReaderComponent");
    try {
      this.clearMessages();
      await this.loadTransport();
      await this.checkPermissions();
    } catch (error) {
      throw error;
    }
  }

  async checkPermissions() {
    // NFC.enabled()
    return this.nfc.enabled()
      .then(() => {
        console.log('NFC está habilitado');
        this.nfcIsEnabled = true;
        // this.successMessage ="NFC ACTIVATED";
      })
      .catch((error) => {
        // this.errorMessage = "NOT ACTIVE"
        console.error('NFC no está habilitado: ', error);
        this.nfcIsEnabled = false;
        throw new Error('Permisos denegados: Active NFC');
      });
  }

  getFormattedDate(): string {
    const date = new Date();
  
    const day   = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
    const year  = date.getFullYear().toString();
  
    const hours   = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  
    console.log(formattedDate); // Ejemplo de salida: "2024-07-08T14:35:20"
    return formattedDate;
  }

  async getGpsLocation() {
    this.clearMessages();
    try {
      const coordinates = await Geolocation.getCurrentPosition({enableHighAccuracy: true});
      console.log('Current position:', coordinates);
  
      return {
        lat: coordinates.coords.latitude.toString(),
        lon: coordinates.coords.longitude.toString(),
      };      
    } catch (error) {
      console.log(error);
      throw error;      
    }
  }

  // ---------------------------
  // **        BORRAR         **
  // ---------------------------

  async simulateGetIn() {
    this.clearMessages();
    const clientData = {
      get:        "in",
      payerEmail: "ips01007@vogco.com",
      payerSub:   ".....",
      guestEmail: "prueba_60@mailinator.com", 
      guestDni:   "10123321", 
    };
    const clientDataString = JSON.stringify(clientData)

    try {
      await this.processScan(clientDataString);
    } catch (error) { 
      console.log(error);
      this.catchErrorMessage(error)
      // setTimeout(() => {
      //   this.router.navigate(['/home']);
      // }, 5000);
    }

    const stringArray = [];

    const clientData_1 = {
      get:        "in",
      payerEmail: "ips01007@vogco.com",
      payerSub:   "....",
      // guestEmail: "prueba_60@mailinator.com", 
      // guestDni:   "10123321", 
    };
    stringArray.push(JSON.stringify(clientData_1));
    
    const clientData_2 = {
      get:        "in",
      payerEmail: "prueba_60@mailinator.com",
      payerSub:   "....",
      // guestEmail: "prueba_60@mailinator.com", 
      // guestDni:   "10123321", 
    };
    stringArray.push(JSON.stringify(clientData_2));
    
    const clientData_3 = {
      get:        "in",
      payerEmail: "prueba_50@mailinator.com",
      payerSub:   "....",
      // guestEmail: "prueba_60@mailinator.com", 
      // guestDni:   "10123321", 
    };
    stringArray.push(JSON.stringify(clientData_3));

    for (let i = 0; i < stringArray.length; i++) {
      try {
        localStorage.setItem('selectedRouteOption', 'A1');
        await this.processScan(stringArray[i]);
      } catch (error) {
        console.log(error);
        this.catchErrorMessage(error)
      }
    }    
  }

  async simulateGetOut() {
    this.clearMessages();
    const clientData = {
      get:        "out",
      payerEmail: "ips01007@vogco.com",
      payerSub:   "...."
    };
    const clientDataString = JSON.stringify(clientData)

    try {
      await this.processScan(clientDataString);
    } catch (error) { 
      console.log(error);
      
      this.catchErrorMessage(error)
      // setTimeout(() => {
      //   this.router.navigate(['/home']);
      // }, 5000);
    }
    
  }

  // ---------------------------
  // **        BORRAR         **
  // ---------------------------
  async startScan() {
    this.clearMessages();
    try {
      if (!this.nfcIsEnabled) {
        throw new Error('NFC is not enabled on this device');
      }

      // NFC.addNdefListener().subscribe(
      // this.nfc.addNdefListener().subscribe(
      //   async (event) => {
      //     const payload = event.tag.ndefMessage[0].payload;
      //     this.scannedResult = this.nfc.bytesToString(payload).substring(3);
      //     this.debugMsg = 'NFC tag scanned successfully';
          
      //     await this.processScan(this.scannedResult);
      //     this.router.navigate(['/home']);
      //   },
      //   (err) => {
      //     console.log(err);
      //     this.catchErrorMessage(err);
      //   }
      // );
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }    
  }

  async processScan(scannedDataString: string) {
    try {
      const scannedData = JSON.parse(scannedDataString);
      if (!scannedData.payerEmail || !scannedData.payerEmail || !scannedData.get) {
        throw new Error('Error al procesar el codigo QR, intentelo de nuevo');
      } 

      const clientData: ITicketClientData = {
        get:        scannedData.get,
        payerEmail: scannedData.payerEmail,
        payerSub:   scannedData.payerSub,
        guestEmail: scannedData.guestEmail || undefined, 
        guestDni:   scannedData.guestDni   || undefined, 
      };

      if (clientData.get === "in") {
        console.log("in");        
        await this.processGetIn(clientData);
      } else {
        console.log("out");        
        await this.processGetOut(clientData);
      }
    } catch (error) {
      console.log(error);      
      throw error
    }
  }
 
  async processGetIn(clientData: ITicketClientData) {
    console.log("processEntrance");    
    try {
      const routeOption = localStorage.getItem('selectedRouteOption');   
      if (!routeOption || typeof routeOption !== "string") {        
        throw new Error('Error: no se selecciono ninguna sección de viaje');
      } else {
        this.selectedRouteOption = routeOption
        localStorage.removeItem('selectedRouteOption');
      } 
      const onlinePaymentString = localStorage.getItem('onlinePayment');
      if (onlinePaymentString == null || (onlinePaymentString != "true" && onlinePaymentString != "false") ) {
        throw new Error('Error al procesar el tipo de pago (online u ofline), intentelo de nuevo');
      }
      const onlinePayment = onlinePaymentString === "true"? true : false;

      const gps = await this.getGpsLocation();
      const transportData: ITicketTransportData = {
        licensePlate: this.transport?.licensePlate!,
        routeNumber:  this.transport?.routeNumber!,
        routeOption:  this.selectedRouteOption,
        ticketDate:   this.getFormattedDate(),
        gpsLocation:  gps,
      }

      const paymentData: ITicketDataPayment = {
        transportData: transportData,
        clientData: clientData,
        onlinePayment: onlinePayment
      };
  
      try {
        await this.ticketService.sendGetInTicket(paymentData);
        await this.ticketService.saveLocalGetInCopy(paymentData, true);
        
        this.successMessage = 'Viaje registrado, muchas gracias :)'
        
        setTimeout(() => {
          this.clearMessages();
          this.router.navigate(['/home']);
        }, 2500);
      } catch (error) {
        console.log(error);        
        // en caso de que el error sea producido por fallo de conexion 
        if (error instanceof HttpErrorResponse && error.status === 0) {
          console.log("error.status === 0");
          if (paymentData.onlinePayment) {
            throw new Error('Hay problemas de conexión con el servidor, por favor, pague en efectivo o intentelo de nuevo');
          } else if (!paymentData.onlinePayment) {
            try {
              await this.ticketService.saveLocalGetInCopy(paymentData, false);
              this.successMessage = 'Viaje registrado, es posible que tarde algun tiempo en verlo dentro del apartado Historial'  
              setTimeout(() => {
                this.clearMessages();
                this.router.navigate(['/home']);
              }, 2500);
            } catch (error) {
              console.log(error);
              throw error;
            }
            return;
          }
        } else {
          throw error
        }
      }
    } catch (error) {
      throw error
    }
  }

  async processGetOut(clientData: ITicketClientData) {
    console.log("processGetOut");
    try {      
      // 1 verifico que el usuario haya realizado un get-in
      const hasGetIn = await Storage.get({ key: clientData.payerEmail });
      if (!hasGetIn.value) {
        throw new Error('Registro no encontrado: por favor registre su ascenso primero');
      }    
      const value: ILocalStorageTicket = JSON.parse(hasGetIn.value);
      console.log(value);      
      if (!instanceOfLocalStorageTicket(value)) {        
        throw new Error('Error al procesar su pasage, por favor intente de nuevo');
      }

      const gps = await this.getGpsLocation();
      const getOutData: ITicketGetOut = {
        userEmail: value.clientData.guestEmail? value.clientData.guestEmail : value.clientData.payerEmail,
        travelDate: value.transportData.ticketDate,
        routeNumber: value.transportData.routeNumber,
        outDate: this.getFormattedDate(),
        outLocation: gps
      };
      value.getOutData = getOutData;

      try {
        if (value.isOnline) {
          // if this goes well, it is not necesarry to store a local copy of getOutData
          await this.ticketService.sendGetOutTicket(getOutData);
          await Storage.remove({ key: clientData.payerEmail });
        } else {
          await this.ticketService.saveLocalGetOutCopy(getOutData);
        }

        this.successMessage = 'Descenso registrado, hasta pronto :)';

        setTimeout(() => {
          this.clearMessages();
          this.router.navigate(['/home']);
        }, 2500);
      } catch (error) {
        console.log(error);        
        // en caso de que el error sea producido por fallo de conexion 
        if (error instanceof HttpErrorResponse && error.status === 0) {
          console.log("error.status === 0");
          try {
            await this.ticketService.saveLocalGetOutCopy(getOutData);
            this.successMessage = 'Descenso registrado, hasta pronto :)';  
            setTimeout(() => {
              this.clearMessages();
              this.router.navigate(['/home']);
            }, 2500);
          } catch (error) {
            console.log(error);
            throw error;
          }
          return;
        } else {
          throw error
        }
      }
    } catch (error) {        
      console.log(error);        
      throw error; 
    }        
  }

  stopScan() {
    this.clearMessages();
    
    // document.getElementById('camSection')?.classList.remove('personal-transparent');
    // document.querySelector('body')?.classList.remove('scanner-active');
  }
}
