import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { ISignInCredentials } from '../../interfaces/i-sign-in-credentials';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent  implements OnInit {
  errorMessage = '';

  signinForm = new FormGroup({
    licensePlate: new FormControl('', [Validators.required]),
    password:  new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  constructor(
    private loginService: LoginService, 
    private router: Router
  ) { }
  
  get licensePlate() { return this.signinForm.get('licensePlate'); }
  get password()  { return this.signinForm.get('password');  }

  ngOnInit() {
    this.errorMessage = '';
  }

  async signin() {
    try {
      const signinCredential: ISignInCredentials = {
        licensePlate: this.licensePlate!.value!,
        password:  this.password!.value!
      };
      
      await this.loginService.signIn(signinCredential);
      
      this.router.navigate(['/login/config']);
    } catch (error) {
      console.log(error);   
      if (error instanceof Error) { this.errorMessage = error.message; } else
      if (error instanceof HttpErrorResponse) { 
        this.errorMessage = error.error.message === undefined ? error.message : error.error.message
      } else { this.errorMessage = 'Unknown error: ' + error; }
    }
  }

}
