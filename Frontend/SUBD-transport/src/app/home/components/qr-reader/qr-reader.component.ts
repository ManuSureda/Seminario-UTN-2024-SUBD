import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ITransport } from 'src/app/login/interfaces/i-transport';
import { ITicketClientData } from '../../interfaces/i-ticket-client-data';
import { ITicketTransportData } from '../../interfaces/i-ticket-transport-data';
import { ITicketDataPayment } from '../../interfaces/i-ticket-data-payment';
import { TicketService } from '../../../services/ticket.service';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { Geolocation } from '@capacitor/geolocation';
import { HttpErrorResponse } from '@angular/common/http';
import { TransportService } from '../../../services/transport.service';
import { ITicketGetOut } from '../../interfaces/i-ticket-get-out';
import { ILocalStorageTicket, instanceOfLocalStorageTicket } from '../../interfaces/i-local-storage-ticket';

@Component({
  selector: 'app-qr-reader',
  templateUrl: './qr-reader.component.html',
  styleUrls: ['./qr-reader.component.scss'],
})
export class QrReaderComponent  implements OnInit, OnDestroy {
  transport: ITransport | null = null;
  selectedRouteOption = ''

  debugMsg = '';
  successMessage = '';
  errorMessage = '';
  qrData = '';
  scannedResult: any;
  isScanning: boolean = false;

  constructor(
    private ticketService : TicketService,
    private transportService: TransportService,
    private router : Router
  ) { }

  async ngOnInit() {
    console.log("QrReaderComponent ngOnInit");
  }

  // runs when the page is about to enter and become the active page.
  async ionViewWillEnter() {
    console.log("QrReaderComponent ionViewWillEnter");
    try {
      await this.initializeComponent();
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  async initializeComponent() {
    console.log("initialize - QrReaderComponent");

    try {
      this.clearMessages();
      this.qrData = '';

      await this.loadTransport();

      const permision = await this.checkPermissions();
      console.log(permision);
      
      if (!permision) {
        throw new Error('Permisos denegados: CAMARA');
      }

      await this.startScan();
    } catch (error) {
      this.catchErrorMessage(error);
    }
  }

  clearMessages() {
    this.debugMsg = '';
    this.successMessage = '';
    this.errorMessage = '';
  }

  catchErrorMessage(error: any) {
    if (error instanceof HttpErrorResponse) {
      this.errorMessage = error.error.message || error.message;
    } else if (error instanceof Error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = String(error);
    }
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 3000);
  }

  async loadTransport() {
    try {
      if (localStorage.getItem('refreshTransport')) {
        console.log('if refreshTransport');
        await this.transportService.fetchTransportByLicensePlate(this.transport?.licensePlate!);
        localStorage.removeItem('refreshTransport');
      }

      // if (!this.transport) {
        console.log("if !transport");
        const transport = await Storage.get({ key: 'transport' });
        if (transport && typeof transport.value === "string") {
          this.transport = JSON.parse(transport.value);
          console.log(transport);
          
        }
      // }
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  async checkPermissions() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      console.log(status);
      
      if (status.neverAsked) {
        const status2 = await BarcodeScanner.checkPermission();
        console.log(status2);
        
        return status2.granted ? true : false;
      }      

      return status.granted ? true : false;
    } catch (error) {
      console.log(error);
      throw error;
    }
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

  // BORRAR ----------------
  // async loadTestTransport(){
  //   this.clearMessages();
  //   try {
  //     await this.transportService.fetchTransportByLicensePlate('AAA-006')
  //     await this.loadTransport();      
  //   } catch (error) {
  //     this.catchErrorMessage(error)
  //   }
  // }






  async simulateBigGetIn() {

    // usuario_01@mailinator.com
    // 84627215-8a97-484a-ae1d-f2ef4e34c9db

    // usuario_02@mailinator.com
    // 840a396d-30b8-4414-8068-7d6413410c24

    // usuario_03@mailinator.com
    // a9d40107-10ba-4ac4-8518-113051ab3520


    this.clearMessages();    
    const stringArray = [];

    let clientData = {
      get:        "in",
      payerEmail: "usuario_01@mailinator.com",
      payerSub:   "84627215-8a97-484a-ae1d-f2ef4e34c9db",
      // guestEmail: "prueba_60@mailinator.com", 
      // guestDni:   "10123321", 
    };
    stringArray.push(JSON.stringify(clientData));


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

  async simulateGetIn() {
    this.clearMessages();
    let clientData = {
      get:        "in",
      payerEmail: "usuario_01@mailinator.com",
      payerSub:   "84627215-8a97-484a-ae1d-f2ef4e34c9db",
      // guestEmail: "prueba_60@mailinator.com", 
      // guestDni:   "10123321", 
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

  async simulateGetOut() {
    this.clearMessages();
    let clientData = {
      get:        "out",
      payerEmail: "usuario_01@mailinator.com",
      payerSub:   "84627215-8a97-484a-ae1d-f2ef4e34c9db",
      // guestEmail: "prueba_60@mailinator.com", 
      // guestDni:   "10123321", 
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
  // BORRAR ----------------

  async startScan() {
    this.clearMessages();
    try {
      const permission = await this.checkPermissions();
      if (!permission) {
        this.errorMessage = 'Error: permisos de la camara negados.';
        return;
      } 
  
      // Mostrar la cámara
      await BarcodeScanner.hideBackground();
  
      const scannerPromise = new Promise<{ content: string }>((resolve, reject) => {
        // cambiar back por front
        BarcodeScanner.startScan({cameraDirection: 'back'}).then(result => {
          if (result?.content) {
            resolve(result);
          } else {
            reject('No QR code content found');
          }
        }).catch(err => {
          reject(err);
        });
      });
  
      const timeOutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => {
          reject('timeout');
        }, 15000);
      });
  
      const result = await Promise.race([scannerPromise, timeOutPromise]);
  
      if (result && typeof result === 'object' && 'content' in result) {
        this.scannedResult = result.content;
        this.debugMsg = 'QR code scanned successfully';
        this.stopScan(); // Detener el escaneo

        await this.processScan(this.scannedResult); // Procesar el escaneo
        this.router.navigate(['/home']);
      } else { // paso el tiempo de ejecuccion y no logramos escanear nada
        this.debugMsg = 'No se detecto nada'
        setTimeout(() => {
          this.stopScan(); // Detener el escaneo
          this.router.navigate(['/home']);
        }, 3000)
      }
    } catch (error) {
      console.log("catch startScan");      
      console.log(error);
     
      if (error === 'timeout') {
        this.debugMsg = 'No se detecto ningun QR!';
      } else {
        this.catchErrorMessage(error);
      }
      this.stopScan();
      BarcodeScanner.showBackground();
      this.isScanning = false;
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 5000);
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
  
      console.log(paymentData);      

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
    this.isScanning = false;
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    // document.getElementById('camSection')?.classList.remove('personal-transparent');
    // document.querySelector('body')?.classList.remove('scanner-active');
  }

  ionViewWillLeave() {
    this.stopScan();
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
