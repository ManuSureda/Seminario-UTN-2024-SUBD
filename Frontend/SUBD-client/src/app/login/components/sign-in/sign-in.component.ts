import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { ISignInCredentials } from '../../interfaces/i-sign-in-credentials';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { envConfig } from 'src/app/config/envConfig';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent  implements OnInit {

  borrar= envConfig.EXPRESS_API

  errorMessage = '';

  signinForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    password:  new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  constructor(private loginService: LoginService, private router: Router) { }
  
  get userEmail() { return this.signinForm.get('userEmail'); }
  get password()  { return this.signinForm.get('password');  }

  async ngOnInit() {
    this.errorMessage = '';

    try {
      const user = await Storage.get({ key: 'user' });
      if (user && typeof user === "string") {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.log(error);      
      this.errorMessage = String(error);
    }
  }

  // runs when the page is about to enter and become the active page.
  async ionViewWillEnter() {
    console.log("SignInComponent ionViewWillEnter");
    try {
      await this.initializeComponent();
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  async initializeComponent() {
    this.errorMessage = '';

    try {
      const user = await Storage.get({ key: 'user' });
      if (user && typeof user === "string") {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.log(error);      
      this.catchErrorMessage(error);
    }
  }

  catchErrorMessage(error: any) {
    if (error instanceof HttpErrorResponse) {      
      if (error.error.code === "UserNotFoundException") {        
        this.errorMessage = "correo electronico y o contraseña incorrecta";
      } else {
        this.errorMessage = error.error.message || error.message;
      }
    } else if (error instanceof Error) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = String(error);
    }
  }

  async signin(): Promise<any> {
    try {
      const signinCredential: ISignInCredentials = {
        userEmail: this.userEmail!.value!,
        password:  this.password!.value!
      };
      
      await this.loginService.signIn(signinCredential);

      this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);   
      this.catchErrorMessage(error);
    }
  }
}
