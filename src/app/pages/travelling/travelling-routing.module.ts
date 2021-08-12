import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'search',
    component: SearchPageComponent
  },
  {
    path: 'property-detail',
    component: PropertyDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class TravellingRoutingModule { }
