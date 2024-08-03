import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { ISignUpCredentials } from '../../interfaces/i-sign-up-credentials';
import { IResendConfirmationCodeCredentials } from '../../interfaces/i-resend-confirmation-code-credentials';
import { IConfirmationCodeCredentials } from '../../interfaces/i-confirmation-code-credentials';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent  implements OnInit {
  successMessage = '';
  errorMessage   = '';

  signupFlag                 = true;
  reSendConfirmationCodeFlag = false;
  sendConfirmationCodeFlag   = false;

  signupForm = new FormGroup({
    transportEmail: new FormControl('', [Validators.required,Validators.email]),
    licensePlate:   new FormControl('', [Validators.required]),
    password:       new FormControl('', [Validators.required,Validators.minLength(6)]),
    routeNumber:    new FormControl('', [Validators.required]),
  });

  reSendConfirmationCodeForm = new FormGroup({
    rs_licensePlate: new FormControl('',[Validators.required])
  });

  confirmationCodeForm = new FormGroup({
    cc_licensePlate:  new FormControl('',[Validators.required]),
    confirmationCode: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(6)])
  });

  constructor(private loginService: LoginService, private router: Router) { }

  // signup form
  get transportEmail() { return this.signupForm.get('transportEmail'); }
  get licensePlate()   { return this.signupForm.get('licensePlate');   }
  get password()       { return this.signupForm.get('password');       }
  get routeNumber()    { return this.signupForm.get('routeNumber');    }
  // re send confirmation code form
  get rs_licensePlate() { return this.reSendConfirmationCodeForm.get('rs_licensePlate'); }
  // confirmation code form
  get cc_licensePlate()  { return this.confirmationCodeForm.get('cc_licensePlate'); }
  get confirmationCode() { return this.confirmationCodeForm.get('confirmationCode');  }
  
  // --------------------------------------------------------------------------------------------------
  // todo arreglar paginacion 
  ngOnInit() {
    this.successMessage = '';
    this.errorMessage   = '';
    this.activateSignupFlag();
  }

  // -------------------------------------------------------------------------------------------------------------

  // signup section
  activateSignupFlag(): void {
    this.successMessage = '';
    this.errorMessage   = '';
    this.sendConfirmationCodeFlag = false;
    this.reSendConfirmationCodeFlag = false;
    this.signupFlag = true;
  }

  async signup(): Promise<void> {    
    this.successMessage = '';
    this.errorMessage   = '';
    this.reSendConfirmationCodeFlag = false;
    this.sendConfirmationCodeFlag = false;

    sessionStorage.clear();
    
    const signupCredential: ISignUpCredentials = {
      transportEmail: this.transportEmail!.value!,
      licensePlate:   this.licensePlate!.value!,
      routeNumber:    this.routeNumber!.value!,
      password:       this.password!.value!
    };

    try {
      const result = await this.loginService.signUp(signupCredential);
      console.log(result);
      this.successMessage = result.message;

      this.cc_licensePlate?.setValue(signupCredential.licensePlate);
      this.rs_licensePlate?.setValue(signupCredential.transportEmail);

      setTimeout(() => {
        this.activateConfirmationCodeFlag();
      }, 3000);

    } catch (error) {
      console.log(error);   
      this.successMessage = '';
      if (error instanceof Error) { this.errorMessage = error.message; } else
      if (error instanceof HttpErrorResponse) { 
        this.errorMessage = error.error.message === undefined ? error.message : error.error.message
      } else { this.errorMessage = 'Unknown error: ' + error; }
    }
  }
  // end of: signup section

  // re send confirmation code section
  activateReSendConfirmationCodeFlag(): void {
    this.sendConfirmationCodeFlag = false;
    this.signupFlag = false;
    this.reSendConfirmationCodeFlag = true;
  }

  async reSendConfirmationCode(): Promise<void> {
    this.sendConfirmationCodeFlag = false;
    this.reSendConfirmationCodeFlag = true;
    
    try {
      const body: IResendConfirmationCodeCredentials = {
        transportEmail: this.rs_licensePlate!.value!
      };
      const promise = await this.loginService.reSendConfirmationCode(body);
      
      this.successMessage = promise.message;
      this.activateConfirmationCodeFlag();
    } catch (error) {
      console.log(error);   
      this.successMessage = '';
      if (error instanceof Error) { this.errorMessage = error.message; } else
      if (error instanceof HttpErrorResponse) { 
        this.errorMessage = error.error.message === undefined ? error.message : error.error.message
      } else { this.errorMessage = 'Unknown error: ' + error; }
    }
  }
  // end of: re send confirmation code section

  // send confirmation code section
  activateConfirmationCodeFlag(): void {
    this.reSendConfirmationCodeFlag = false;
    this.signupFlag = false;
    this.sendConfirmationCodeFlag = true;
  }

  async sendConfirmationCode(): Promise<void> {
    this.sendConfirmationCodeFlag = true;
    
    try {
      const confirmationCodeCredentials: IConfirmationCodeCredentials = {
        licensePlate: this.cc_licensePlate!.value!,
        confirmationCode: this.confirmationCode!.value!
      };

      const result = await this.loginService.sendConfirmationCode(confirmationCodeCredentials);
      
      this.successMessage = result.message;
      this.sendConfirmationCodeFlag = false;
      setTimeout(() => {
        this.router.navigate(['/login/sign-in']);
      }, 3000);        
    } catch (error) {
      console.log(error);   
      this.successMessage = '';
      if (error instanceof Error) { this.errorMessage = error.message; } else
      if (error instanceof HttpErrorResponse) { 
        this.errorMessage = error.error.message === undefined ? error.message : error.error.message
      } else { this.errorMessage = 'Unknown error: ' + error; }
    }
  }
  // end of: send confirmation code section

}
