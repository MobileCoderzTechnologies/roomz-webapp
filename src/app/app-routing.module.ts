import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LOGIN_ROUTE, SIGN_UP_ROUTE, TRAVELLING_ROUTE } from './constants/route.constants';


const routes: Routes = [
  {
    path: '',
    redirectTo: TRAVELLING_ROUTE.path,
    pathMatch: 'full'
  },
  {
    path: 'travelling',
    loadChildren: () => import('./pages/travelling/travelling.module').then(m => m.TravellingModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./modules/otp/otp.module').then(m => m.OtpModule)
  },
  {
    path: 'ar', children: [
      {
        path: '',
        redirectTo: TRAVELLING_ROUTE.path,
        pathMatch: 'full'
      },
      {
        path: 'travelling',
        loadChildren: () => import('./pages/travelling/travelling.module').then(m => m.TravellingModule)
      },
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
