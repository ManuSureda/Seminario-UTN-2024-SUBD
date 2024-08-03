import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service';
import { envConfig } from '../config/envConfig';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("entre en canActive");
    
    let url = state.url;

    const token = localStorage.getItem('token');
    if (token) {
      console.log("true");
      
      return true;
    } else {
      this.router.navigate([envConfig.UNAUTH_REDIRECT_URL]);
      return false;
    }
  }
}
