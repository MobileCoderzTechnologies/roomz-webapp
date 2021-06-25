import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TRAVELLING_ROUTE } from './constants/route.constants';

const routes: Routes = [
  {
    path: '',
    redirectTo: TRAVELLING_ROUTE.path,
    pathMatch: 'full',
  },
  {
    path: 'travelling',
    loadChildren: () =>
      import('./pages/travelling/travelling.module').then(
        (m) => m.TravellingModule
      ),
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
        path: 'travelling',
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
export class AppRoutingModule {}
