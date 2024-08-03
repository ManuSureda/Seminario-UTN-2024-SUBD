import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/i-user';
import { UserService } from '../../../services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITicketClientData } from '../../interfaces/i-ticket-client-data';
import { Storage } from '@capacitor/storage';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-qr-ticket',
  templateUrl: './qr-ticket.component.html',
  styleUrls: ['./qr-ticket.component.scss'],
})
export class QrTicketComponent implements OnInit {
  user: IUser | null = null;

  debugMsg = '';
  successMessage = '';
  errorMessage = '';

  qrDataString: any;
  qrFlag: boolean = false;
  toggleValue: boolean = false;

  qrGuestForm = new FormGroup({
    guestDni:   new FormControl('', [Validators.required, Validators.pattern(/^\d{8}$/)]),
    guestEmail: new FormControl('', [Validators.email])
  });

  constructor(
    private userService: UserService,
  ) {}

  get guestEmail() { return this.qrGuestForm.get('guestEmail'); }
  get guestDni()   { return this.qrGuestForm.get('guestDni');   }

  async ngOnInit() {
    console.log("qr-ticket-component ngOnInit");
    // this.initializeComponent();
  }

  async ionViewWillLeave() {
    console.log("qr-ticket-component ionViewWillLeave");
    this.qrDataString = "";
    this.clearMessages();
  }

  // runs when the page is about to enter and become the active page.
  async ionViewWillEnter() {
    console.log("qr-ticket-component ionViewWillEnter");
    try {
      await this.initializeComponent();
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  async initializeComponent() {
    console.log("initialize - qr-ticket-component");

    this.qrDataString = "";

    try {
      this.clearMessages();

      await this.loadUser();
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

  async loadUser() {
    try {
      if (localStorage.getItem('refreshUser')) {
        console.log("if refreshUser");
        await this.userService.fetchUserByEmail(this.user?.userEmail!);
        localStorage.removeItem('refreshUser');
      }

      // if (!this.user) {
        // console.log("if !user");
        const user = await Storage.get({ key: 'user' });
        if (user && typeof user.value === "string") {
          this.user = JSON.parse(user.value);
        }
      // }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // -----------------------------

  onToggleChange(event: any) {
    this.qrDataString = '';
    this.qrFlag = false;
    this.toggleValue = event.detail.checked;
  }

  cancelQr() {
    this.qrFlag = false;
    this.qrDataString = '';
  }

  generateQR() {
    const qrObject: ITicketClientData = {
      get:        "in",
      payerEmail: this.user?.userEmail!,
      payerSub:   this.user?.userSub!
    };

    this.qrDataString = JSON.stringify(qrObject);
    this.qrFlag = true; 

    localStorage.setItem('refreshUser', "true");
    localStorage.setItem('refreshTravels', "true");
  }

  generateQRForGuest() {
    const qrObject: ITicketClientData = {
      get:        "in",
      payerEmail: this.user?.userEmail!,
      payerSub:   this.user?.userSub!,
      guestDni:   this.guestDni!.value!,
      guestEmail: this.guestEmail?.value!,
    };
    console.log(JSON.stringify(qrObject));
    
    this.qrDataString = JSON.stringify(qrObject);
    this.qrFlag = true;

    localStorage.setItem('refreshUser', "true");
    localStorage.setItem('refreshTravels', "true");
  }
}
