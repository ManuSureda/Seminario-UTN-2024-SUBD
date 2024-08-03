import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomeRoutingModule } from './home-routing.module';
import { BalanceManagementComponent } from './components/balance-management/balance-management.component';
import { HistoryComponent } from './components/history/history.component';
import { HomeComponent } from './components/home/home.component';
import { NfcTicketComponent } from './components/nfc-ticket/nfc-ticket.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { QrTicketComponent } from './components/qr-ticket/qr-ticket.component';
import { GetOutComponent } from './components/get-out/get-out.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';



@NgModule({
  declarations: [BalanceManagementComponent, HistoryComponent, HomeComponent, 
    NfcTicketComponent, PersonalInformationComponent, QrTicketComponent, GetOutComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    HomeRoutingModule,
    QRCodeModule
  ]
})
export class HomeModule { }
