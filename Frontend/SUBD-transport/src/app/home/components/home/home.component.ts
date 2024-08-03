import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { ITransport } from 'src/app/login/interfaces/i-transport';
import { TransportService } from '../../../services/transport.service';
import { TicketService } from '../../../services/ticket.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit, OnDestroy{
  transport: ITransport | null = null;

  onlinePayment: boolean = true;

  debugMsg       = '';
  successMessage = '';
  errorMessage   = '';
  optionValue    = '';

  private checkDataSubscription: Subscription | undefined;

  constructor(
    private transportService : TransportService,
    private ticketService : TicketService
  ) { }

  ngOnDestroy(): void {
    this.startCheckingForUnsavedData();
  }

  async ngOnInit() {
    console.log("HomeComponent ngOnInit");
  }

  startCheckingForUnsavedData() {
    console.log("entro en startCheckingForUnsavedData");
    
    if (!this.checkDataSubscription) {
      console.log("if de startCheckingForUnsavedData");      
      // starts the verification each 15 seconds
      this.checkDataSubscription = interval(15000).subscribe(() => {
        this.ticketService.checkAndSendUnsavedData();
      });      
    }
  }

  stopCheckingForUnsavedData() {
    console.log("entro a stop");
    
    if (this.checkDataSubscription) {
      console.log("IF de stop");
      this.checkDataSubscription.unsubscribe();
      this.checkDataSubscription = undefined;
    }
  }

  // runs when the page is about to enter and become the active page.
  async ionViewWillEnter() {
    console.log("HomeComponent ionViewWillEnter");
    console.log(localStorage.getItem('unsavedDataFlag'));
    

    if (localStorage.getItem('unsavedDataFlag') === "true") {
      console.log("FLAG === TRUE");
      
      this.startCheckingForUnsavedData();
    } else {
      console.log("FLAG === FALSE");
      this.stopCheckingForUnsavedData();
    }

    try {
      await this.initializeComponent();
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  async initializeComponent() {
    console.log("initialize - home");

    try {
      this.clearMessages();
      localStorage.setItem('onlinePayment', String(this.onlinePayment))
      console.log("online payment: ", localStorage.getItem('onlinePayment'));
      console.log("option value: ", this.optionValue);
      
      localStorage.setItem('selectedRouteOption', this.optionValue)

      await this.loadTransport();
      // console.log(this.user);
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

  async loadTestTransport(){
    try {
      await this.transportService.fetchTransportByLicensePlate('AAA-006')
      await this.loadTransport();      
    } catch (error) {
      console.log(error);      
    }
  }

  onOptionChange(event: any) {
    console.log(event)
    localStorage.setItem('selectedRouteOption', event.detail.value)
    this.optionValue = event.detail.value;
  }

  onToggleChange(event: any) {
    this.onlinePayment = event.detail.checked;
    console.log(this.onlinePayment);
    localStorage.setItem('onlinePayment', String(this.onlinePayment))
  }
}
