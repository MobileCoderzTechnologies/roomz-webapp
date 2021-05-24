import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravellingRoutingModule } from './travelling-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TravellingRoutingModule
  ],
  exports: [
    TravellingRoutingModule
  ]
})
export class TravellingModule { }
