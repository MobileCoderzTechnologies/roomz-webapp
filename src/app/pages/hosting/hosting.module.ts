import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { HostingRoutingModule } from './hosting-routing.module';
import { PropertyGuestsComponent } from './components/property-guests/property-guests.component';
import { PropertyGuests2Component } from './components/property-guests2/property-guests2.component';
import { PropertyGuests3Component } from './components/property-guests3/property-guests3.component';
import { PropertyGuests4Component } from './components/property-guests4/property-guests4.component';
import { PropertyGuests5Component } from './components/property-guests5/property-guests5.component';
import { PropertyGuests6Component } from './components/property-guests6/property-guests6.component';
import { PropertyGuests7Component } from './components/property-guests7/property-guests7.component';
import { PropertyGuests8Component } from './components/property-guests8/property-guests8.component';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    PropertyGuestsComponent,
    PropertyGuests2Component,
    PropertyGuests3Component,
    PropertyGuests4Component,
    PropertyGuests5Component,
    PropertyGuests6Component,
    PropertyGuests7Component,
    PropertyGuests8Component
  ],
  imports: [
    CommonModule,
    HostingRoutingModule
  ],
  exports: [
    HostingRoutingModule
  ]
})
export class HostingModule { }
