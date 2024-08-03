import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BalanceManagementComponent } from './components/balance-management/balance-management.component';
import { HistoryComponent } from './components/history/history.component';
import { NfcTicketComponent } from './components/nfc-ticket/nfc-ticket.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { QrTicketComponent } from './components/qr-ticket/qr-ticket.component';
import { GetOutComponent } from './components/get-out/get-out.component';

const routes: Routes = [
  { path: '',                     component: HomeComponent                },
  { path: 'personal-information', component: PersonalInformationComponent },
  { path: 'balance-management',   component: BalanceManagementComponent   },
  { path: 'qr',                   component: QrTicketComponent            },
  { path: 'nfc',                  component: NfcTicketComponent           },
  { path: 'history',              component: HistoryComponent             },
  { path: 'get-out',              component: GetOutComponent              },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
