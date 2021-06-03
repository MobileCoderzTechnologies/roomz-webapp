import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ValidateErrorModule } from 'src/app/modules/validate-error/validate-error.module';

const routes: Routes = [
  {
    path: '', component: SignUpComponent
  }
];

@NgModule({
  declarations: [
    SignUpComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ValidateErrorModule,
  ],
  exports: [
    RouterModule,
    SharedModule,
    ValidateErrorModule,
  ]
})
export class SignUpModule { }
