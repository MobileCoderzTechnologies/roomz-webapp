import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ValidateErrorModule } from 'src/app/modules/validate-error/validate-error.module';
import { SignUpModule } from '../sign-up/sign-up.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { OtpComponent } from './components/otp/otp.component';
import { WelcomeBackComponent } from './components/welcome-back/welcome-back.component';
import { OtpTimerPipe } from './pipes/otp-timer.pipe';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    OtpComponent,
    WelcomeBackComponent,
    OtpTimerPipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ValidateErrorModule,
    SignUpModule,
    NgOtpInputModule
  ],
  exports: [
    RouterModule,
    SharedModule,
    LoginComponent,
    ValidateErrorModule,
    SignUpModule
  ]
})
export class LoginModule { }
