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
    path: LOGIN_ROUTE.path,
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: SIGN_UP_ROUTE.path,
    loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpModule)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
