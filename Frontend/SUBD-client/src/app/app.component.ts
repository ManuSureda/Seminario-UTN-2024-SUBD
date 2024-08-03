import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService, 
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    console.log("app.component.ts START");
    
    try {
      console.log("initialize - home");
      
      const [tokenPromise, userPromise] = await Promise.all([
        Storage.get({ key: 'token' }),
        Storage.get({ key: 'user' }),
      ]);

      const token = tokenPromise.value;
      const user = userPromise.value ? JSON.parse(userPromise.value) : null;

      if (token && user && user.userEmail != '') {
        localStorage.setItem('token', token);
        await this.userService.fetchUserByEmail(user.userEmail);
        console.log("app.component.ts: fetch");
      } else {
        this.redirectToLogin();
      }
    } catch (error) {
      console.log(error);
      this.redirectToLogin();
    }
  }

  async redirectToLogin() {
    localStorage.clear();
    await Storage.clear();
    this.router.navigate(['/login']);
  }
}
