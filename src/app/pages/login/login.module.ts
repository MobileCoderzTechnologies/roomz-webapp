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
import {
  SocialLoginModule,
  SocialAuthServiceConfig
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { GOOGLE_KEY } from 'src/app/constants/social-keys.constant';

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
    NgOtpInputModule,
    SocialLoginModule,
  ],
  exports: [
    RouterModule,
    SharedModule,
    LoginComponent,
    ValidateErrorModule,
    SignUpModule,
    SocialLoginModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(GOOGLE_KEY.clientId)
          }
        ],
      } as SocialAuthServiceConfig
    }
  ]
})
export class LoginModule { }
