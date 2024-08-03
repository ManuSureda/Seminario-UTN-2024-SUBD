import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrReaderComponent } from './components/qr-reader/qr-reader.component';
import { NfcReaderComponent } from './components/nfc-reader/nfc-reader.component';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { HomeComponent } from './components/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [QrReaderComponent, NfcReaderComponent, HomeComponent],
  imports: [
    CommonModule,
    IonicModule,
    QRCodeModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class HomeModule { }
