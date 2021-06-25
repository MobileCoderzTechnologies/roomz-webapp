import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { HostingRoutingModule } from './hosting-routing.module';
import { PropertyGuestsComponent } from './components/property-guests/property-guests.component';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    PropertyGuestsComponent
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
