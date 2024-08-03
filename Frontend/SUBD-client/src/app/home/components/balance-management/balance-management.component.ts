import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/i-user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { PaymentService } from '../../../services/payment.service';
import { IPaymentData } from '../../interfaces/i-payment-data';
import { HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@capacitor/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-balance-management',
  templateUrl: './balance-management.component.html',
  styleUrls: ['./balance-management.component.scss'],
})
export class BalanceManagementComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  debugMsg: string = '';

  user: IUser | null = null;

  private navigationSubscription: Subscription | null = null;

  sendForm = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+$/)])
  });

  constructor(
    private userService: UserService,
    private paymentService: PaymentService
  ) { }

  get amount() { return this.sendForm.get('amount'); }

  async ngOnInit() {
    console.log("BalanceManagementComponent ngOnInit");
    // this.initializeComponent();
  }

  // runs when the page is about to enter and become the active page.
  async ionViewWillEnter() {
    console.log("BalanceManagementComponent ionViewWillEnter");
    try {
      await this.initializeComponent();
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  async initializeComponent() {
    console.log("initialize - BalanceManagementComponent");

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

  async loadTestUser() {
    this.userService.fetchUserByEmail('ips01007@vogco.com');
    await this.loadUser();
  }

  logUser() {
    console.log("balance-management. logUser: ");
    console.log(this.user);
  }

  async onSubmit() {
    this.clearMessages();
    try {
      const paymentData: IPaymentData = {
        userEmail: this.user!.userEmail,
        amount: parseFloat(this.amount!.value!)
      };

      const result = await this.paymentService.mpDeposit(paymentData);
      console.log("onSubmit, result: ");
      console.log(result);
      console.log("-------------------");
      this.successMessage = result.paymentUrl

      localStorage.setItem('refreshUser', 'true');
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.successMessage);
  }
}
