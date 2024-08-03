import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { IUser } from '../../interfaces/i-user';
import { Storage } from '@capacitor/storage';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
})
export class PersonalInformationComponent  implements OnInit {
  user: IUser | null = null;

  debugMsg = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
  ) { }

  async ngOnInit() {
    console.log("PersonalInformationComponent ngOnInit");
    // this.initializeComponent();
  }

  // runs when the page is about to enter and become the active page.
  async ionViewWillEnter() {
    console.log("PersonalInformationComponent ionViewWillEnter");
    try {
      await this.initializeComponent();
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  async initializeComponent() {
    console.log("initialize - PersonalInformationComponent");

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

  async refreshUserData() {
    console.log("refreshUserData");
    localStorage.setItem('refreshUser', 'true');
    try {
      await this.loadUser();
    } catch (error) {
      this.catchErrorMessage(error);
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

  loadTestUser() {
    this.userService.fetchUserByEmail('ips01007@vogco.com');
    this.loadUser();
  }

  logUser() {
    console.log("personal informations: ");    
    console.log(this.user);
  }

}
