import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { IUser } from '../../interfaces/i-user';
import { Router } from '@angular/router';
import { TravelService } from '../../../services/travel.service';
import { ITravel } from '../../interfaces/i-travel';
import { Storage } from '@capacitor/storage';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent  implements OnInit {
  user: IUser | null = null;
  fullTravelList: ITravel[] | null = null;
  travelList: ITravel[] | null = null;

  travelFrom: number = 1;
  travelTo: number = 10;

  specificTravel: ITravel | null = null;

  debugMsg:       string = '';
  successMessage: string = '';
  errorMessage:   string = '';

  constructor(
    private userService: UserService,
    private travelService: TravelService
  ) { }

  async ngOnInit() {
    console.log("HistoryComponent ngOnInit");
    // this.initializeComponent();
  }

  // runs when the page is about to enter and become the active page.
  async ionViewWillEnter() {
    console.log("HistoryComponent ionViewWillEnter");
    try {
      await this.initializeComponent();
    } catch (error) {
      console.log(error);
      this.catchErrorMessage(error);
    }
  }

  async initializeComponent() {
    console.log("initialize - HistoryComponent");
    this.travelFrom = 1;
    this.travelTo = 10;

    try {
      this.clearMessages();

      await this.loadUser();
      await this.loadTravelList();
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
    try {
      localStorage.setItem('refreshTravels', 'true');
      await this.loadTravelList();
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

  async loadTravelList() {
    try {
      if (localStorage.getItem('refreshTravels')) {
        console.log("if refreshTravel");
        await this.travelService.fetchTravelListByUserEmail(this.user?.userEmail!);
        localStorage.removeItem('refreshTravels');
      }

      // if (!this.fullTravelList) {
        const travels = await Storage.get({ key: 'travels' });
        if (travels && typeof travels.value === "string") {
          this.fullTravelList = JSON.parse(travels.value);
        }              
      // }
      this.travelList = this.fullTravelList!.slice(this.travelFrom - 1, this.travelTo);
    } catch (error) {
      throw error;
    }
  }

  pagination(right: boolean) {
    console.log(right);
    
    if (right) {
      if (this.travelTo < this.fullTravelList!.length) {
        this.travelFrom = this.travelTo;
        this.travelTo += 10;
        if (this.travelTo <= this.fullTravelList!.length) {
          this.travelList = this.fullTravelList!.slice(this.travelFrom - 1, this.travelTo);
        } else {
          this.travelList = this.fullTravelList!.slice(this.travelFrom - 1, this.fullTravelList!.length);
        }
      }
    } else {
      if (this.travelFrom > 1) {
        this.travelTo = this.travelFrom;
        this.travelFrom -= 10;
        if (this.travelFrom >= 1) {
          this.travelList = this.fullTravelList!.slice(this.travelFrom - 1, this.travelTo);
        } else {
          this.travelFrom = 1;
          this.travelList = this.fullTravelList!.slice(0, this.travelTo);
        }
      }
    }
  }

  showSpecificTravel(travel : ITravel) {
    this.specificTravel = travel;
    console.log(travel);
    console.log(typeof travel);    
  }

  // async loadTestUser() {
  //   this.specificTravel = null;
  //   this.userService.fetchUserByEmail('ips01007@vogco.com');
  //   await this.loadUser();

  //   await this.loadTravelList();
  //   console.log(this.user);
  //   console.log(this.travelList);    
  // }

  // logUser() {
  //   this.specificTravel = null;
  //   console.log(this.user);
  // }
}
