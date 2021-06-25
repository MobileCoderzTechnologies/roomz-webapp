import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HOSTING_ROUTE, TRAVELLING_ROUTE } from './constants/route.constants';

const routes: Routes = [
  {
    path: '',
    redirectTo: TRAVELLING_ROUTE.path,
    pathMatch: 'full',
  },
  {
    path: TRAVELLING_ROUTE.path,
    loadChildren: () =>
      import('./pages/travelling/travelling.module').then(
        (m) => m.TravellingModule
      ),
  },
  {
    path: HOSTING_ROUTE.path,
    loadChildren: () =>
      import('./pages/hosting/hosting.module').then(m => m.HostingModule)
  },
  {
    path: 'ar',
    children: [
      {
        path: '',
        redirectTo: TRAVELLING_ROUTE.path,
        pathMatch: 'full',
      },
      {
        path: TRAVELLING_ROUTE.path,
        loadChildren: () =>
          import('./pages/travelling/travelling.module').then(
            (m) => m.TravellingModule
          ),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
