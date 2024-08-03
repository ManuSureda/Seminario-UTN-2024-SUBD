import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { IUser } from '../../interfaces/i-user';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nfc-ticket',
  templateUrl: './nfc-ticket.component.html',
  styleUrls: ['./nfc-ticket.component.scss'],
})
export class NfcTicketComponent implements OnInit {

  user: IUser | null = null;

  debugMsg:       string = '';
  successMessage: string = '';
  errorMessage:   string = '';
  
  toggleValue: boolean = false;
  isNfcAvailable: boolean = false;

  NfcGuestForm = new FormGroup({
    guestDni:   new FormControl('', [Validators.required, Validators.pattern('[0-9]+'), Validators.minLength(8), Validators.maxLength(8)]),
    guestEmail: new FormControl('', [Validators.email])
  });

  constructor(
    private userService: UserService,
    private nfc: NFC,
    private ndef: Ndef,
    private router: Router
  ) { }

  get guestEmail() { return this.NfcGuestForm.get('guestEmail'); }
  get guestDni()   { return this.NfcGuestForm.get('guestDni');   }


  async ngOnInit() {
    console.log("NfcTicketComponent ngOnInit nuevo v2");
  }

  // runs when the page is about to enter and become the active page.
  async ionViewWillEnter() {
    console.log("NfcTicketComponent ionViewWillEnter");
    try {
      await this.initializeComponent();
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  ionViewWillLeave() {
    console.log("NfcTicketComponent ionViewWillLeave");
    this.nfc.unshare();
  }

  async checkNfcPermissions() {
    console.log("checkNfcPermissions");
    try {
      const platform = Capacitor.getPlatform();
      const isNfcAvailable = await this.nfc.enabled();
      if (!isNfcAvailable || platform === 'web') {
        this.isNfcAvailable = false;
        throw new Error('NFC no está habilitado en este dispositivo.');
      } else {
        this.isNfcAvailable = true;
        await Storage.set({ key: 'isNfcAvailable', value: 'true' });
      }
      console.log('NFC y permisos verificados.');
    } catch (error) {
      this.isNfcAvailable = false;
      throw new Error('NFC no está habilitado en este dispositivo.');
    }
  }

  async initializeComponent() {
    console.log("initialize - NfcTicketComponent");

    try {
      this.clearMessages();
      
      await this.loadUser();

      await this.checkNfcPermissions();
      
      this.nfc.unshare();
    } catch (error) {
      throw error;
    }
  }

  clearMessages() {
    this.debugMsg = '';
    this.successMessage = '';
    this.errorMessage = '';
  }

  catchErrorMessage(error: any) {
    console.log("---");
    
    if (error instanceof HttpErrorResponse) {
      this.errorMessage = error.error.message || error.message;
    } else if (error instanceof Error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = String(error);
    }
    if (this.isNfcAvailable == false) {
      setTimeout(() => {
        this.errorMessage = '';
        this.router.navigate(['/home']);
      }, 4000);
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

  onToggleChange(event: any) {
    this.toggleValue = event.detail.checked;
  }

  async generateNfcTicket() {
    this.nfc.unshare();
    const ticketData = {
      payerEmail: this.user?.userEmail!,
      payerSub: this.user?.userSub!
    };
    
    const message = this.ndef.textRecord(JSON.stringify(ticketData));
    this.nfc.share([message]).then(() => {
      localStorage.setItem('refreshUser', "true");
      localStorage.setItem('refreshTravels', "true");
      this.successMessage = 'Aproxime su telefono al lector';
    }).catch((error) => {
      this.catchErrorMessage(error);
    });
  }

  async generateNfcTicketForGuest() {
    this.nfc.unshare();
    const ticketData = {
      payerEmail: this.user?.userEmail!,
      payerSub: this.user?.userSub!,
      guestDni: this.guestDni!.value!,
      guestEmail: this.guestEmail?.value!
    };

    const message = this.ndef.textRecord(JSON.stringify(ticketData));
    this.nfc.share([message]).then(() => {
      localStorage.setItem('refreshUser', "true");
      localStorage.setItem('refreshTravels', "true");
      this.successMessage = 'Aproxime su telefono al lector';
    }).catch((error) => {
      this.catchErrorMessage(error);
    });
  }
}
