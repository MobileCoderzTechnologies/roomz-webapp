import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { HostingRoutingModule } from './hosting-routing.module';
import { PropertyGuestsComponent } from './components/property-guests/property-guests.component';
import { PropertyGuests2Component } from './components/property-guests2/property-guests2.component';
import { PropertyGuests3Component } from './components/property-guests3/property-guests3.component';
import { PropertyGuests4Component } from './components/property-guests4/property-guests4.component';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    PropertyGuestsComponent,
    PropertyGuests2Component,
    PropertyGuests3Component,
    PropertyGuests4Component
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
