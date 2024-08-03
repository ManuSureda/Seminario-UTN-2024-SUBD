import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../interfaces/i-user';
import { LoginService } from 'src/app/services/login.service';
import { Storage } from '@capacitor/storage';
import { HttpErrorResponse } from '@angular/common/http';
import { TravelService } from '../../../services/travel.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: IUser | null = null;

  debugMsg: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private travelService: TravelService,
    private router: Router
  ) { }

  async ngOnInit() {
    console.log("HomeComponent ngOnInit");
    // this.initializeComponent();
  }

  // runs when the page is about to enter and become the active page.
  async ionViewWillEnter() {
  /**
   * Run your code and you will see it take so long time to launch your 
   * page. So never put heavy synchronous code into ionViewWillEnter. 
   * Just use asynchronous in ionViewWillEnter and move all synchronous 
   * code to ionViewDidEnter. Because in there, your page is entered 
   * and it will make a better UX.
   */
    console.log("HomeComponent ionViewWillEnter");
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
      
      await this.loadUser();
      
      await this.checkOnTravel();
    } catch (error) {
      this.catchErrorMessage(error);
    }
  }

  async checkOnTravel() {
    try {
      if (localStorage.getItem('refreshTravels')) {
        console.log("checkOnTravel");
        
        const updatedListLenght = await this.travelService.fetchTravelListByUserEmail(this.user?.userEmail!);
        console.log("updatedListLenght: " + updatedListLenght);
        if (Number(localStorage.getItem('localTravelsLength')) < updatedListLenght) {
          console.log(Number(localStorage.getItem('localTravelsLength')) + ' < ' + updatedListLenght);
          
        } else {
          console.log("no se registro ningun viaje nuevo");
          return;
        }
      } else {
        return;
      }
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

  // async loadTestUser() {
  //   this.userService.fetchUserByEmail('ips01007@vogco.com');
  //   await this.loadUser();
  // }

  logUser() {
    console.log("home: ");
    console.log(this.user);
  }

  signOut() {
    this.loginService.signOut();
    this.router.navigate(['/login']);
  }
}
