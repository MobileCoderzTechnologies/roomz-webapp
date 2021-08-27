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
import { AddPhotoComponent } from '../sign-up/components/add-photo/add-photo.component';


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
  // {
  //   path: 'test',
  //   component: AddPhotoComponent
  // }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravellingRoutingModule {}
