import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/i-user';
import { Storage } from '@capacitor/storage';
import { LoginService } from '../../../services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { ITicketClientData } from '../../interfaces/i-ticket-client-data';
import { Capacitor } from '@capacitor/core';
import { Ndef, NFC } from '@awesome-cordova-plugins/nfc/ngx';

@Component({
  selector: 'app-get-out',
  templateUrl: './get-out.component.html',
  styleUrls: ['./get-out.component.scss'],
})
export class GetOutComponent  implements OnInit {

  user: IUser | null = null;

  debugMsg = '';
  successMessage = '';
  errorMessage = '';

  isQr = false;
  isNfc = false;
  isNfcAvailable: boolean = false;

  qrDataString: any;
  qrFlag: boolean = false;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private nfc: NFC,
    private ndef: Ndef,
  ) { }

  async ngOnInit() {
    console.log("GetOutComponent ngOnInit");
    // this.initializeComponent();
  }

  // runs when the page is about to enter and become the active page.
  async ionViewWillEnter() {
    this.isNfc = false;
    this.isQr = false;

    this.qrDataString = '';
    this.qrFlag = false;
    console.log("GetOutComponent ionViewWillEnter");
    try {
      await this.initializeComponent();
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
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
    console.log("initialize - GetOutComponent");

    try {
      this.clearMessages();

      await this.loadUser();
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
    this.isNfc = false;
    this.isQr = false;
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

  useQr() {
    console.log("useQr");
    
    this.clearMessages();

    this.isQr = true;
    this.qrFlag = false;
    this.qrDataString = '';
    const qrObject: ITicketClientData = {
      get:        "out",
      payerEmail: this.user?.userEmail!,
      payerSub:   this.user?.userSub!
    };

    this.qrDataString = JSON.stringify(qrObject);
    this.qrFlag = true; 

    localStorage.setItem('refreshUser', "true");
    localStorage.setItem('refreshTravels', "true");
  }

  async useNfc() {
    this.clearMessages();
    try {
      await this.checkNfcPermissions();   
      console.log("no deberia llegar");      
      this.isNfc = true;   

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
    } catch (error) {
      this.catchErrorMessage(error);
    }
  }

}
