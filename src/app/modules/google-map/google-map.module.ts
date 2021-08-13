import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
import { MAP_KEY } from 'src/app/constants/google-map-key.constant';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: MAP_KEY.key,
      libraries: ['places']
    })
  ],
  exports: [
    AgmCoreModule
  ]
})
export class GoogleMapModule { }
