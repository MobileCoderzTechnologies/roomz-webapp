import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../hosting/components/home/home.component';
import { PropertyGuestsComponent } from '../hosting/components/property-guests/property-guests.component';
import { PropertyGuests2Component } from '../hosting/components/property-guests2/property-guests2.component';
import { PropertyGuests3Component } from '../hosting/components/property-guests3/property-guests3.component';
import { PropertyGuests4Component } from './components/property-guests4/property-guests4.component';
import { PropertyGuests5Component } from './components/property-guests5/property-guests5.component';
import { PropertyGuests6Component } from './components/property-guests6/property-guests6.component';
import { PropertyGuests7Component } from './components/property-guests7/property-guests7.component';
import { PropertyGuests8Component } from './components/property-guests8/property-guests8.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'property-guests',
    component: PropertyGuestsComponent,
  },
  {
    path: 'property-guests2',
    component: PropertyGuests2Component,
  },
  {
    path: 'property-guests3',
    component: PropertyGuests3Component,
  },
  {
    path: 'property-guests4',
    component: PropertyGuests4Component,
  },
  {
    path: 'property-guests5',
    component: PropertyGuests5Component,
  },
  {
    path: 'property-guests6',
    component: PropertyGuests6Component,
  },
  {
    path: 'property-guests7',
    component: PropertyGuests7Component,
  },
  {
    path: 'property-guests8',
    component: PropertyGuests8Component,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostingRoutingModule {}
