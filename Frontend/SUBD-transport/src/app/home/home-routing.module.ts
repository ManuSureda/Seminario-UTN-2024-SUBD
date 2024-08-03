import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrReaderComponent } from './components/qr-reader/qr-reader.component';
import { NfcReaderComponent } from './components/nfc-reader/nfc-reader.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '',     component: HomeComponent      },
  { path: 'qr',   component: QrReaderComponent  },
  { path: 'nfc',  component: NfcReaderComponent },
  // { path: '**',   redirectTo: '/home'           }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
