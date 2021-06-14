import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ValidateErrorModule } from 'src/app/modules/validate-error/validate-error.module';
import { NativeDateModule } from '@angular/material/core';
import { AddPhotoComponent } from './components/add-photo/add-photo.component';
import { CongratulationsComponent } from './components/congratulations/congratulations.component';


const routes: Routes = [
  {
    path: '', component: SignUpComponent
  }
];

@NgModule({
  declarations: [
    SignUpComponent,
    AddPhotoComponent,
    CongratulationsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ValidateErrorModule,
    NativeDateModule,
  ],
  exports: [
    SignUpComponent,
    RouterModule,
    SharedModule,
    ValidateErrorModule,
    NativeDateModule,
  ]
})
export class SignUpModule { }
