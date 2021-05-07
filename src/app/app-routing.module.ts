import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LOGIN_ROUTE, SIGN_UP_ROUTE } from './constants/route.constants';

const routes: Routes = [
  {
    path: '',
    redirectTo: LOGIN_ROUTE.path,
    pathMatch: 'full'
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
