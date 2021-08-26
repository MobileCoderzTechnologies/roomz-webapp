import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../hosting/components/home/home.component';
import { PropertyGuestsComponent } from '../hosting/components/property-guests/property-guests.component';
import { PropertyGuests2Component } from '../hosting/components/property-guests2/property-guests2.component';
import { PropertyGuests4Component } from './components/property-guests4/property-guests4.component';
import { PropertyGuests5Component } from './components/property-guests5/property-guests5.component';
import { PropertyGuests6Component } from './components/property-guests6/property-guests6.component';
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
import { PropertyGuests19Component } from './components/property-guests19/property-guests19.component';
import { PropertyGuests20Component } from './components/property-guests20/property-guests20.component';
import { PropertyGuests21Component } from './components/property-guests21/property-guests21.component';
import { StartComponent } from './components/start/start.component';
import { PropertyGuests22Component } from './components/property-guests22/property-guests22.component';
import { PropertyGuests23Component } from './components/property-guests23/property-guests23.component';
import { PropertyGuests24Component } from './components/property-guests24/property-guests24.component';
import { PropertyGuests25Component } from './components/property-guests25/property-guests25.component';
import { PropertyGuests26Component } from './components/property-guests26/property-guests26.component';
import { PropertyGuests27Component } from './components/property-guests27/property-guests27.component';
import { PropertyGuests28Component } from './components/property-guests28/property-guests28.component';
import {
  LISTING_HOME_ROUTE,
  MY_LISTING_ROUTE,
  START_ROUTE,
  STEP_10_ROUTE,
  STEP_11_ROUTE,
  STEP_12_ROUTE,
  STEP_13_ROUTE,
  STEP_14_ROUTE,
  STEP_16_ROUTE,
  STEP_17_ROUTE,
  STEP_18_ROUTE,
  STEP_19_ROUTE,
  STEP_1_ROUTE,
  STEP_20_ROUTE,
  STEP_21_ROUTE,
  STEP_22_ROUTE,
  STEP_23_ROUTE,
  STEP_2_ROUTE,
  STEP_3_ROUTE,
  STEP_4_ROUTE,
  STEP_5_ROUTE,
  STEP_6_ROUTE,
  STEP_7_ROUTE,
  STEP_8_ROUTE,
  STEP_9_ROUTE,
} from './constants/route.constant';
import { PropertyViewComponent } from './components/property-view/property-view.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyPreviewComponent } from './components/property-preview/property-preview.component';
import { CancellationPolicyComponent } from './components/cancellation-policy/cancellation-policy.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: MY_LISTING_ROUTE.path,
    pathMatch: 'full',
  },
  {
    path: MY_LISTING_ROUTE.path,
    component: PropertyListComponent
  },
  {
    path: LISTING_HOME_ROUTE.path,
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: START_ROUTE.path,
        pathMatch: 'full',
      },
      {
        path: START_ROUTE.path,
        component: StartComponent,
      },
      {
        path: `${START_ROUTE.path}/:id`,
        component: StartComponent,
      },
      {
        path: `${STEP_1_ROUTE.path}`,
        component: PropertyGuestsComponent,
      },
      {
        path: `${STEP_1_ROUTE.path}/:id`,
        component: PropertyGuestsComponent,
      },
      {
        path: `${STEP_2_ROUTE.path}/:id`,
        component: PropertyGuests2Component,
      },
      {
        path: `${STEP_3_ROUTE.path}/:id`,
        component: PropertyGuests4Component,
      },
      {
        path: `${STEP_4_ROUTE.path}/:id`,
        component: PropertyGuests5Component,
      },
      {
        path: `${STEP_5_ROUTE.path}/:id`,
        component: PropertyGuests6Component,
      },
      {
        path: `${STEP_6_ROUTE.path}/:id`,
        component: PropertyGuests22Component,
      },
      {
        path: `${STEP_7_ROUTE.path}/:id`,
        component: PropertyGuests17Component,
      },
      // {
      //   path: `${STEP_8_ROUTE.path}/:id`,
      //   component: PropertyDetailsComponent
      // },
      {
        path: `${STEP_8_ROUTE.path}/:id`,
        component: PropertyGuests8Component,
      },
      {
        path: `${STEP_9_ROUTE.path}/:id`,
        component: PropertyPreviewComponent
      },
      {
        path: `${STEP_10_ROUTE.path}/:id`,
        component: PropertyGuests10Component,
      },
      {
        path: `${STEP_11_ROUTE.path}/:id`,
        component: PropertyGuests12Component,
      },
      {
        path: `${STEP_12_ROUTE.path}/:id`,
        component: PropertyGuests13Component,
      },
      {
        path: `${STEP_13_ROUTE.path}/:id`,
        component: PropertyGuests15Component,
      },
      {
        path: `${STEP_14_ROUTE.path}/:id`,
        component: PropertyGuests23Component,
      },
      {
        path: `${STEP_16_ROUTE.path}/:id`,
        component: PropertyGuests25Component,
      },
      {
        path: `${STEP_17_ROUTE.path}/:id`,
        component: PropertyGuests26Component,
      },
      {
        path: `${STEP_18_ROUTE.path}/:id`,
        component: PropertyGuests19Component,
      },
      {
        path: `${STEP_19_ROUTE.path}/:id`,
        component: PropertyGuests20Component,
      },
      {
        path: `${STEP_20_ROUTE.path}/:id`,
        component: PropertyGuests21Component,
      },
      {
        path: `${STEP_21_ROUTE.path}/:id`,
        component: PropertyGuests27Component,
      },
      {
        path: `${STEP_22_ROUTE.path}/:id`,
        component: PropertyGuests28Component,
      },
      {
        path: `${STEP_23_ROUTE.path}/:id`,
        component: CancellationPolicyComponent
      }
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostingRoutingModule {}
