import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravellingRoutingModule } from './travelling-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { LangTranslateModule } from 'src/app/modules/translate/lang-translate.module';
import { HomeComponent } from './components/home/home.component';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    TravellingRoutingModule,
    SharedModule,
  ],
  exports: [
    TravellingRoutingModule,
    SharedModule,
  ]
})
export class TravellingModule { }
