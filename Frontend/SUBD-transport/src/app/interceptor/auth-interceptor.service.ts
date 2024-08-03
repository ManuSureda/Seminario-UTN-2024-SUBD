import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { envConfig } from 'src/app/config/envConfig';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  unAuthUrl: string = envConfig.UNAUTH_REDIRECT_URL;

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("interceptor");
    const token = localStorage.getItem('token');
    
    let request = req;
    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        } // tube que cambiarlo a una a minuscula, por que express lo toma de esa manera 
        // setHeaders: {
        //   authorization: `Bearer ${token}`
        // }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403) {
          this.router.navigate([this.unAuthUrl]);
        }
        return throwError(err);
      })
    );
  }
}
