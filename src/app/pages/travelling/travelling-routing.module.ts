import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import {
  PROPERTY_DETAIL_ROUTE,
  SEARCH_PAGE_ROUTE,
} from './constants/route.constant';
import { SafetyComponent } from './components/safety/safety.component';
import { CancellationPolicyComponent } from './components/cancellation-policy/cancellation-policy.component';
import { HouseRulesComponent } from './components/house-rules/house-rules.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: SEARCH_PAGE_ROUTE.path,
    component: SearchPageComponent,
  },
  {
    path: `${PROPERTY_DETAIL_ROUTE.path}/:id`,
    component: PropertyDetailComponent,
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravellingRoutingModule {}
