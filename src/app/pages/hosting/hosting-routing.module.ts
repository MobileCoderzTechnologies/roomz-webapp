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
import { LISTING_HOME_ROUTE, START_ROUTE, STEP_1_ROUTE } from './constansts/route.constant';
import { StartComponent } from './components/start/start.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: LISTING_HOME_ROUTE.path,
    pathMatch: 'full'
  },
  {
    path: LISTING_HOME_ROUTE.path,
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: START_ROUTE.path,
        pathMatch: 'full'
      },
      {
        path: START_ROUTE.path,
        component: StartComponent
      },
      {
        path: STEP_1_ROUTE.path,
        component: PropertyGuestsComponent
      }
    ]
  },
  // {
  //   path: 'property-guests',
  //   component: PropertyGuestsComponent,
  // },
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
  {
    path: 'property-guests9',
    component: PropertyGuests9Component,
  },
  {
    path: 'property-guests10',
    component: PropertyGuests10Component,
  },
  {
    path: 'property-guests11',
    component: PropertyGuests11Component,
  },
  {
    path: 'property-guests12',
    component: PropertyGuests12Component,
  },
  {
    path: 'property-guests13',
    component: PropertyGuests13Component,
  },
  {
    path: 'property-guests14',
    component: PropertyGuests14Component,
  },
  {
    path: 'property-guests15',
    component: PropertyGuests15Component,
  },
  {
    path: 'property-guests16',
    component: PropertyGuests16Component,
  },
  {
    path: 'property-guests17',
    component: PropertyGuests17Component,
  },
  {
    path: 'property-guests18',
    component: PropertyGuests18Component,
  },
  {
    path: 'property-guests19',
    component: PropertyGuests19Component,
  },
  {
    path: 'property-guests20',
    component: PropertyGuests20Component,
  },
  {
    path: 'property-guests21',
    component: PropertyGuests21Component,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostingRoutingModule {}
