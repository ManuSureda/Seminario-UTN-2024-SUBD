import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { ILocalidad, IMunicipio, IProvincia } from '../../interfaces/georef-interfaces';
import { ISignUpCredentials } from '../../interfaces/sign-up-credentials';
import { HttpErrorResponse } from '@angular/common/http';
import { IConfirmationCodeCredentials } from '../../interfaces/i-confirmation-code-credentials';
import { Router } from '@angular/router';
import { IResendConfirmationCodeCredentials } from '../../interfaces/i-resend-confirmation-code-credentials';

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

  provinces:      Array<IProvincia> = [];
  municipalities: Array<IMunicipio> = [];
  cities:         Array<ILocalidad> = [];

  signupForm = new FormGroup({
    userEmail:        new FormControl('', [Validators.required,Validators.email]),
    password:         new FormControl('', [Validators.required,Validators.minLength(6)]),
    dni:              new FormControl('', [Validators.required,Validators.minLength(8),Validators.maxLength(8),Validators.pattern(/[0-9]+/)]),
    name:             new FormControl('', [Validators.required]),
    lastName:         new FormControl('', [Validators.required]),
    province:         new FormControl('', [Validators.required]),
    municipality:     new FormControl('', [Validators.required]),
    city:             new FormControl('', [Validators.required]),
    postalCode:       new FormControl(''),
    emergencyContact: new FormControl(''),
    healthInsurance:  new FormControl(''),
    insurancePlan:    new FormControl('')
  });

  reSendConfirmationCodeForm = new FormGroup({
    rs_userEmail:     new FormControl('',[Validators.required,Validators.email])
  });

  confirmationCodeForm = new FormGroup({
    cc_userEmail:     new FormControl('',[Validators.required,Validators.email]),
    confirmationCode: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(6)])
  });

  constructor(private loginService: LoginService, private router: Router) { }

  // signup form
  get userEmail()        { return this.signupForm.get('userEmail');        }
  get password()         { return this.signupForm.get('password');         }
  get dni()              { return this.signupForm.get('dni');              }
  get name()             { return this.signupForm.get('name');             }
  get lastName()         { return this.signupForm.get('lastName');         }
  get province()         { return this.signupForm.get('province');         }
  get municipality()     { return this.signupForm.get('municipality');     }
  get city()             { return this.signupForm.get('city');             }
  get postalCode()       { return this.signupForm.get('postalCode');       }
  get emergencyContact() { return this.signupForm.get('emergencyContact'); }
  get healthInsurance()  { return this.signupForm.get('healthInsurance');  }
  get insurancePlan()    { return this.signupForm.get('insurancePlan');    }
  // re send confirmation code form
  get rs_userEmail()     { return this.reSendConfirmationCodeForm.get('rs_userEmail'); }
  // confirmation code form
  get cc_userEmail()     { return this.confirmationCodeForm.get('cc_userEmail');     }
  get confirmationCode() { return this.confirmationCodeForm.get('confirmationCode'); }
  
  // --------------------------------------------------------------------------------------------------
  ngOnInit() {
    this.successMessage = '';
    this.errorMessage   = '';
    this.loadProvinces(); 
    this.activateSignupFlag();
  }

  async loadProvinces() {
    try {
      const resultProvinces = await this.loginService.getProvinces();
      this.provinces = resultProvinces.provincias;
    } catch (error) {
      console.error(error);
    }
  }

  async onProvinceChange(event: any) {
    try {
      const provinceId = event.detail.value; //'Santa Fe'
      if (provinceId) {
        this.province?.setValue(provinceId);
        await this.loadMunicipios(provinceId);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HttpErrorResponse) {
        this.errorMessage = error.error.message;
      } else if (error instanceof Error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = "Error desconocido, es posible que el servidor de SUBD o de la api geo ref esten caidos, por favor intentelo de nuevo mas tarde";
      }
    }
  }

  async loadMunicipios(provinciaId: string, inicio: number = 0) {
    try {
      const resultMunicipios = await this.loginService.getMunicipios(provinciaId, inicio);
      this.municipalities = resultMunicipios.municipios;
      // console.log(this.municipalities);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async onMunicipalityChange(event: any) {
    try {
      const municipalityId = event.detail.value;
      if (municipalityId) {
        this.municipality?.setValue(municipalityId);
        // console.log(municipalityId);
        await this.loadCities(municipalityId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loadCities(municipalityId: string, inicio: number = 0) {
    try {
      const resultCities = await this.loginService.getLocalidades(municipalityId, inicio);
      this.cities = resultCities.localidades;
      // console.log(this.cities);
    } catch (error) {
      console.error(error);
    }
  }

  async onCityChange(event: any) {
    try {
      const cityId = event.detail.value;
      if (cityId) {
        this.city?.setValue(cityId);
        // console.log(municipalityId);
      }
    } catch (error) {
      console.log(error);
    }
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
    console.log("signup: signup()");
    
    this.successMessage = '';
    this.errorMessage   = '';
    this.reSendConfirmationCodeFlag = false;
    this.sendConfirmationCodeFlag = false;

    sessionStorage.clear();
    
    const signupCredential: ISignUpCredentials = {
      userEmail:        this.userEmail!.value!,
      password:         this.password!.value!,
      dni:              this.dni!.value!,
      name:             this.name!.value!,
      lastName:         this.lastName!.value!,
      province:         this.province!.value!,
      municipality:     this.municipality!.value!,
      city:             this.city!.value!,
      postalCode:       this.postalCode!.value!,
      emergencyContact: this.emergencyContact!.value!,
      healthInsurance:  this.healthInsurance!.value!,
      insurancePlan:    this.insurancePlan!.value!
    };

    try {
      const result = await this.loginService.signUp(signupCredential);
      console.log(result);
      this.successMessage = result.message;

      this.cc_userEmail?.setValue(signupCredential.userEmail);
      this.rs_userEmail?.setValue(signupCredential.userEmail);

      setTimeout(() => {
        this.activateConfirmationCodeFlag();
      }, 3000);

    } catch (error) {
      console.log(error);   
      this.successMessage = '';
      if (error instanceof Error) { this.errorMessage = error.message; } else
      if (error instanceof HttpErrorResponse) { this.errorMessage = error.error.message; } 
      else { this.errorMessage = 'Unknown error: ' + error; }
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
        userEmail: this.rs_userEmail!.value!
      };
      const promise = await this.loginService.reSendConfirmationCode(body);
      
      this.successMessage = promise.message;
      this.activateConfirmationCodeFlag();
    } catch (error) {
      console.log(error);   
      this.successMessage = '';
      if (error instanceof Error) { this.errorMessage = error.message; } else
      if (error instanceof HttpErrorResponse) { 
        if (error.error.code === "InvalidParameterException") {
          this.errorMessage = `Dicha cuenta (${this.rs_userEmail!.value!}) ya se encuentra confirmada`;  
        } else {
          this.errorMessage = error.error.message; 
        }
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
        userEmail: this.cc_userEmail!.value!,
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
      if (error instanceof HttpErrorResponse) { this.errorMessage = error.error.message; } else 
      { this.errorMessage = 'Unknown error: ' + error; }
    }
  }
  // end of: send confirmation code section
}
