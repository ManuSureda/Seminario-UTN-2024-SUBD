import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { ITransport } from '../../interfaces/i-transport';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@capacitor/storage';
import { TransportService } from '../../../services/transport.service';
import { IUpdateRouteNumber } from '../../interfaces/i-update-route-number';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent  implements OnInit {
  transport: ITransport | null = null;
  
  dataFlag : boolean = true;
  
  debugMsg       : string = '';
  successMessage : string = '';
  errorMessage   : string = '';

  updateForm = new FormGroup({
    u_routeNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}[a-zA-Z]?$/)]),
    // u_travelCost:  new FormControl('', [Validators.pattern(/[0-9]+/), Validators.min(1)]),
  })

  constructor(
    private transportService: TransportService,
    private router: Router
  ) { }

  get u_routeNumber() { return this.updateForm.get('u_routeNumber'); }  
  // get u_travelCost()  { return this.updateForm.get('u_travelCost');  }

  async ngOnInit() {
    console.log("ngOnInit config: start");    
    // this.transport = this.loginService.getTransportLogged();
  }

  async ionViewWillEnter() {
    this.clearMessages();
    try {
      await this.loadTransport();
      console.log("ngOnInit config: end");
    } catch (error) {
      console.log(error);
      this.errorMessage = 'Error al cargar la informacion del vehiculo, redirigiendo al login...'
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 4000);
    }
  }

  async loadTransport() {
    try {      
      const transportPromise = await Storage.get({key: 'transport'})
      
      if (transportPromise.value == null || transportPromise.value == '') {
        this.errorMessage = 'Error al cargar la informacion del vehiculo, redirigiendo al login...'
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000);
        
      } else {
        this.transport = JSON.parse(transportPromise.value!)
        console.log(this.transport);        
      }
    } catch (error) {
      this.errorMessage = 'Error al cargar la informacion del vehiculo, redirigiendo al login...'
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 4000);
    }
  }

  // show info checkHandler
  onToggleChange(event: any) {
    this.dataFlag = event.detail.checked;
  }

  // // BORRAR -------------------------
  // async loadTestTransport(){
  //   await this.transportService.fetchTransportByLicensePlate('AAA-003')
  //   await this.loadTransport()
  // }
  // // BORRAR -------------------------

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
  }

  async refreshTransport() {
    if (this.transport?.licensePlate == null || this.transport?.licensePlate == '') {
      this.errorMessage = 'Error al cargar la informacion del vehiculo, redirigiendo al login...'
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 4000);     
    } else {
      await this.transportService.fetchTransportByLicensePlate(this.transport?.licensePlate)
      await this.loadTransport()
    }
  }

  async updateTransport() {
    this.clearMessages();
    try {
      const updateCredentials: IUpdateRouteNumber = {
        licensePlate: this.transport!.licensePlate!,
        routeNumber: this.u_routeNumber!.value!,
      }
  
      await this.transportService.updateRouteNumber(updateCredentials);
      
      this.successMessage = 'Numero de linea actualizada correctamente';      

      await this.loadTransport()

      setTimeout(() => {
        this.successMessage = '';
      }, 4000);
    } catch (error) {
      this.catchErrorMessage(error);
    }
  }

}
