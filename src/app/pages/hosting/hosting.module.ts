import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { HostingRoutingModule } from './hosting-routing.module';



@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
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
