import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { HostingRoutingModule } from './hosting-routing.module';
import { PropertyGuestsComponent } from './components/property-guests/property-guests.component';
import { PropertyGuests2Component } from './components/property-guests2/property-guests2.component';
import { PropertyGuests4Component } from './components/property-guests4/property-guests4.component';
import { PropertyGuests5Component } from './components/property-guests5/property-guests5.component';
import { PropertyGuests6Component } from './components/property-guests6/property-guests6.component';
import { PropertyGuests7Component } from './components/property-guests7/property-guests7.component';
import { PropertyGuests8Component } from './components/property-guests8/property-guests8.component';
import { PropertyGuests9Component } from './components/property-guests9/property-guests9.component';
import { PropertyGuests10Component } from './components/property-guests10/property-guests10.component';
import { PropertyGuests11Component } from './components/property-guests11/property-guests11.component';
import { PropertyGuests12Component } from './components/property-guests12/property-guests12.component';
import { PropertyGuests13Component } from './components/property-guests13/property-guests13.component';
import { PropertyGuests14Component } from './components/property-guests14/property-guests14.component';
import { PropertyGuests15Component } from './components/property-guests15/property-guests15.component';
import { PropertyGuests16Component } from './components/property-guests16/property-guests16.component';
import { PropertyGuests17Component } from './components/property-guests17/property-guests17.component';
import { PropertyGuests18Component } from './components/property-guests18/property-guests18.component';
import { PropertyGuests19Component } from './components/property-guests19/property-guests19.component';
import { PropertyGuests20Component } from './components/property-guests20/property-guests20.component';
import { PropertyGuests21Component } from './components/property-guests21/property-guests21.component';
import { AvaliablityComponent } from './components/avaliablity/avaliablity.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { StartComponent } from './components/start/start.component';
import { PropertyGuests22Component } from './components/property-guests22/property-guests22.component';
import { PropertyGuests23Component } from './components/property-guests23/property-guests23.component';
import { PropertyGuests24Component } from './components/property-guests24/property-guests24.component';
import { PropertyGuests25Component } from './components/property-guests25/property-guests25.component';
import { PropertyGuests26Component } from './components/property-guests26/property-guests26.component';
import { PropertyGuests27Component } from './components/property-guests27/property-guests27.component';
import { PropertyGuests28Component } from './components/property-guests28/property-guests28.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ValidateErrorModule } from 'src/app/modules/validate-error/validate-error.module';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyViewComponent } from './components/property-view/property-view.component';




@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    PropertyGuestsComponent,
    PropertyGuests2Component,
    PropertyGuests4Component,
    PropertyGuests5Component,
    PropertyGuests6Component,
    PropertyGuests7Component,
    PropertyGuests8Component,
    PropertyGuests9Component,
    PropertyGuests10Component,
    PropertyGuests11Component,
    PropertyGuests12Component,
    PropertyGuests13Component,
    PropertyGuests14Component,
    PropertyGuests15Component,
    PropertyGuests16Component,
    PropertyGuests17Component,
    PropertyGuests18Component,
    PropertyGuests19Component,
    PropertyGuests20Component,
    PropertyGuests21Component,
    AvaliablityComponent,
    ProgressBarComponent,
    StartComponent,
    PropertyGuests22Component,
    PropertyGuests23Component,
    PropertyGuests24Component,
    PropertyGuests25Component,
    PropertyGuests26Component,
    PropertyGuests27Component,
    PropertyGuests28Component,
    PropertyListComponent,
    PropertyViewComponent
  ],
  imports: [
    CommonModule,
    HostingRoutingModule,
    SharedModule,
    ValidateErrorModule
  ],
  exports: [
    HostingRoutingModule,
    SharedModule,
    ValidateErrorModule
  ]
})
export class HostingModule { }
