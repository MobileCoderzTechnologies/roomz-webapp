import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
import { MAP_KEY } from 'src/app/constants/google-map-key.constant';
import { AgmOverlays } from 'agm-overlays';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AgmOverlays,
    AgmCoreModule.forRoot({
      apiKey: MAP_KEY.key,
      libraries: ['places']
    })
  ],
  exports: [
    AgmCoreModule,
    AgmOverlays
  ]
})
export class GoogleMapModule { }
