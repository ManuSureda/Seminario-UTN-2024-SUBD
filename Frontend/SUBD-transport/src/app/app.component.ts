import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { TransportService } from './services/transport.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private transportService: TransportService,
    private router: Router
  ) {}


  // async ngOnInit() {
  //   const a = {
  //     transportEmail: "bke28812@vogco.com",
  //     licensePlate: "AAA-006",
  //     routeNumber: "221",
  //     routeOptions: [
  //         {
  //             name: "A1",
  //             cost: "900"
  //         },
  //         {
  //             name: "A2",
  //             cost: "750"
  //         }
  //     ]
  //   };
  //   await Storage.set({
  //     key: 'transport',
  //     value: JSON.stringify(a)
  //   })
  //   await Storage.set({
  //     key: 'token',
  //     value: 'eyJraWQiOiJ3XC9yV3kzaHdcL09VNkVnWTdNNCttT3JjXC9Wb1pZaXNcL1JNb3dqemM0MFp4ST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI4NDM4MTRhOC02MDQxLTcwMmItNWMwMi1iMTE5NWYyM2JkOTAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV90ejA5RDlVMEgiLCJjbGllbnRfaWQiOiI1czliOGp2MTI1Nm5xNnVqODBldmZqNGhiMCIsIm9yaWdpbl9qdGkiOiJmMmU3Nzg0ZS04NWExLTQ1Y2YtYTdlMS1hMTliNzk4M2VhYjMiLCJldmVudF9pZCI6Ijk4MGJhM2U5LTExZjEtNDBlMy04ODBmLTk4YTBjNDE3NTkwMiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjEyNTk5NDgsImV4cCI6MTcyMTM0NjM0OCwiaWF0IjoxNzIxMjU5OTQ4LCJqdGkiOiI4ODUwYjhmZS00MzA0LTRkYzgtYmZiMy0xNjYxZDUzYTM4YjAiLCJ1c2VybmFtZSI6ImFhYS0wMDYifQ.Ok3pPPCg-TRrsAWAOJG9brG1-fcJPi28r7ZfXbkkFxT_1Mvy_zxm2MZvf0CQSWL2ehA0PyaV6Qh10Gy2zrFNrbrfuVysn23hsA7tIbTzLAhhr62A-ZiLcbr2McDR1tViqLybrn_QqI_XzBHRMlotk22AnuW4wHCTATj0FC5V8f7EaF9XgVRL_gVroMbSJQLC0Fx4C_uw2loZ0J5rbhTYfm8LKuEjutDM4dqCDa8tGgGhYwPzFcRAcDpynDR_JEMjbG8JAz5KbZZeyyh0csxe_Rh-XRgzPYF4_3PzhYB9ABSDH5HEktEPPeMvlUrdKTxMiteDgeTWq76YlGc4cvBgtw'
  //   })

  //   localStorage.setItem('token', 'eyJraWQiOiJ3XC9yV3kzaHdcL09VNkVnWTdNNCttT3JjXC9Wb1pZaXNcL1JNb3dqemM0MFp4ST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI4NDM4MTRhOC02MDQxLTcwMmItNWMwMi1iMTE5NWYyM2JkOTAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV90ejA5RDlVMEgiLCJjbGllbnRfaWQiOiI1czliOGp2MTI1Nm5xNnVqODBldmZqNGhiMCIsIm9yaWdpbl9qdGkiOiJmMmU3Nzg0ZS04NWExLTQ1Y2YtYTdlMS1hMTliNzk4M2VhYjMiLCJldmVudF9pZCI6Ijk4MGJhM2U5LTExZjEtNDBlMy04ODBmLTk4YTBjNDE3NTkwMiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjEyNTk5NDgsImV4cCI6MTcyMTM0NjM0OCwiaWF0IjoxNzIxMjU5OTQ4LCJqdGkiOiI4ODUwYjhmZS00MzA0LTRkYzgtYmZiMy0xNjYxZDUzYTM4YjAiLCJ1c2VybmFtZSI6ImFhYS0wMDYifQ.Ok3pPPCg-TRrsAWAOJG9brG1-fcJPi28r7ZfXbkkFxT_1Mvy_zxm2MZvf0CQSWL2ehA0PyaV6Qh10Gy2zrFNrbrfuVysn23hsA7tIbTzLAhhr62A-ZiLcbr2McDR1tViqLybrn_QqI_XzBHRMlotk22AnuW4wHCTATj0FC5V8f7EaF9XgVRL_gVroMbSJQLC0Fx4C_uw2loZ0J5rbhTYfm8LKuEjutDM4dqCDa8tGgGhYwPzFcRAcDpynDR_JEMjbG8JAz5KbZZeyyh0csxe_Rh-XRgzPYF4_3PzhYB9ABSDH5HEktEPPeMvlUrdKTxMiteDgeTWq76YlGc4cvBgtw')
  //   this.router.navigate(['/home']);
  // }

  async ngOnInit() {
    console.log("app.component.ts START");    

    try {
      const [tokenPromise, transportPromise] = await Promise.all([
        Storage.get({ key: 'token' }),
        Storage.get({ key: 'transport' }),
      ]);

      const token = tokenPromise.value;
      const transport = transportPromise.value ? JSON.parse(transportPromise.value) : null;

      if (token && token != '' && transport && transport.licensePlate != '') {
        localStorage.setItem('token', token);
        console.log("app.component.ts: fetch");
        await this.transportService.fetchTransportByLicensePlate(transport.licensePlate);

        console.log("app.component.ts: redirect to home");
        this.router.navigate(['/login/config']);
      } else {
        console.log("app.component.ts: redirect to login");
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
