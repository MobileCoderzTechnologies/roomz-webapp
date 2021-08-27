import { isPlatformBrowser } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { pipe, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { COUNTRIES_CODES } from 'src/app/constants/country-code.constant';
import { EMAIL_REGEX, PASSWORD } from 'src/app/constants/regex.constant';
import { GOOGLE_KEY } from 'src/app/constants/social-keys.constant';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { SignUpService } from '../sign-up/services/sign-up.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  pageTitle = 'login.pageTitleLoginOrSignUp';
  pageTitleShow = true;
  isBackBtn = false;
  isCloseBtn = true;
  isEnterOtp = false;
  isLoginForm = true;

  phoneNumber: string;
  countryCode: string;
  loginWith = 'phone';

  createAccountAddPhoto = false;
  photoSubs: Subscription;
  welcomeBack = false;
  isAccountSetup = false;

  signUpWithEmail = false;
  signUpWithGoogle = false;
  email = '';

  checkEmailResponse: any;
  afterOtpVerified = { createAccount: false, isVerified: false };
  otpSubs: Subscription;
  loginForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(14)]),
    countryCode: new FormControl('+91', Validators.required),
    email: new FormControl(null),
  });
  isSubmitting = false;

  welcomeBackFromSignUpSubs: Subscription;

  countryCodes = COUNTRIES_CODES;
  constructor(
    private $loginService: LoginService,
    private $signUpService: SignUpService,
    public $dialogRef: MatDialogRef<LoginComponent>,
    private $alert: AlertService,
    private $socialAuthService: SocialAuthService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.otpSubs = this.$loginService.afterOtpVerified
      .pipe(
        delay(0)
      ).subscribe(data => {
        this.afterOtpVerified = data;
        if (data) {
          if (data.createAccount) {
            this.pageTitle = 'signUp.addYourInfo';
            this.isBackBtn = true;
            this.isEnterOtp = false;
            this.pageTitleShow = true;
            this.isCloseBtn = true;
          } else {
            this.isCloseBtn = true;
            this.isEnterOtp = false;
            this.pageTitleShow = true;
            this.loginForm.reset();
          }
        }
      });

    this.photoSubs = this.$signUpService.isAddProfilePhoto
      .pipe(
        delay(0)
      )
      .subscribe(data => {
        if (data) {
          this.createAccountAddPhoto = true;
          // this.signUpWithEmail = false;
          this.pageTitleShow = false;
        }
      });

    this.welcomeBackFromSignUp();
  }

  closeDialog(): void {
    this.$dialogRef.close(null);
  }


  private welcomeBackFromSignUp(): void {
    this.welcomeBackFromSignUpSubs = this.$loginService.welcomeBackFromSignUp
      .pipe(
        delay(0)
      )
      .subscribe(data => {
        if (data) {
          this.checkEmailResponse = {
            email: data.email,
            message: data.message,
          };
          this.welcomeBack = true;
          this.pageTitleShow = false;
          this.isEnterOtp = false;
          this.isCloseBtn = false;
          this.isBackBtn = true;
          this.isLoginForm = false;
          this.afterOtpVerified = null;
        }
      });
  }

  onClickLoginWith(loginType: string): void {
    this.loginWith = loginType;
    this.loginForm.reset();
    if (loginType === 'email') {
      this.loginForm.controls.email.setValidators([Validators.required, Validators.pattern(EMAIL_REGEX)]);
      this.loginForm.controls.phoneNumber.clearValidators();
      this.loginForm.controls.phoneNumber.setValidators(null);
      this.loginForm.controls.phoneNumber.setErrors(null);
      this.loginForm.controls.countryCode.clearValidators();
      this.loginForm.controls.countryCode.setValidators(null);
      this.loginForm.controls.countryCode.setErrors(null);
    }

    if (loginType === 'phone') {
      this.loginForm.controls.email.clearValidators();
      this.loginForm.controls.email.setValidators(null);
      this.loginForm.controls.email.setErrors(null);
      this.loginForm.controls.phoneNumber.setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(14)]);
      this.loginForm.controls.countryCode.setValidators(Validators.required);
      this.loginForm.controls.countryCode.setValue('+91');
    }
  }

  onSubmit(): void {
    const loginData = this.loginForm.value;
    if (loginData.phoneNumber) {
      loginData.phone_number = loginData.phoneNumber;
      loginData.country_code = loginData.countryCode;
      delete loginData.phoneNumber;
      delete loginData.email;
      delete loginData.countryCode;
    }
    this.checkAccount(loginData);
  }

  private checkAccount(loginData: any): void {
    this.isSubmitting = true;
    loginData.login_type = this.loginWith.toUpperCase();

    let checkData;
    if (loginData.country_code) {
      checkData = {
        country_code: loginData.country_code,
        phone_number: loginData.phone_number,
        login_type: loginData.login_type,
      };
    }

    if (loginData.email) {
      checkData = {
        email: loginData.email,
        login_type: loginData.login_type,
      };
    }
    this.$loginService.checkAccount(checkData).subscribe(data => {
      if (data.status === 200) {
        this.isCloseBtn = false;
        this.isEnterOtp = true;
        this.pageTitleShow = false;
        this.isLoginForm = false;
        this.phoneNumber = checkData.phone_number;
        this.countryCode = checkData.country_code;
      }
      if (data.status === 202) {
        this.checkEmailResponse = {
          email: data.body.email,
          message: data.body.message,
        };
        this.welcomeBack = true;
        this.pageTitleShow = false;
        this.isEnterOtp = false;
        this.isCloseBtn = false;
        this.isBackBtn = true;
        this.isLoginForm = false;
      }

      if (data.status === 209) {
        this.pageTitle = 'signUp.addYourInfo';
        this.isBackBtn = true;
        this.isCloseBtn = true;
        this.signUpWithEmail = true;
        this.isLoginForm = false;
        this.email = loginData.email;
      }
      // this.$alert.info(data.body.message);
      this.isSubmitting = false;
    }, err => {
      this.isSubmitting = false;
      console.log(err);
      this.$alert.danger(err.message);
    });
  }


  backFromSignUp(data: { email: string, phoneNumber: string, countryCode: string }): void {
    this.pageTitle = 'login.pageTitleLoginOrSignUp';
    this.pageTitleShow = true;
    this.isBackBtn = false;
    this.isCloseBtn = true;
    this.isLoginForm = true;
    if (data.email) {
      this.signUpWithEmail = false;
      this.signUpWithGoogle = false;
      this.onClickLoginWith('email');
      this.loginForm.controls.email.setValue(data.email);
    }

    if (data.phoneNumber) {
      this.onClickLoginWith('phone');
      this.isEnterOtp = false;
      this.$loginService.afterOtpVerified.next(null);
      this.loginForm.controls.phoneNumber.setValue(data.phoneNumber);
      this.loginForm.controls.countryCode.setValue(data.countryCode);
    }

    this.isLoginForm = true;
  }

  backFromOtp(): void {
    this.isCloseBtn = true;
    this.isEnterOtp = false;
    this.pageTitleShow = true;
    this.isLoginForm = true;
    this.loginForm.reset();
    this.loginForm.controls.countryCode.setValue(this.countryCode);
  }

  backFromWelcomeBack(event): void {
    if (event) {
      this.isCloseBtn = true;
      this.isEnterOtp = false;
      this.pageTitleShow = true;
      this.isLoginForm = true;
      this.welcomeBack = false;
      this.pageTitle = 'login.pageTitleLoginOrSignUp';
      this.loginForm.reset();
      this.loginWith = 'email';
    }
  }


  ngOnDestroy(): void {
    this.isBackBtn = false;
    this.isCloseBtn = true;
    this.isEnterOtp = false;
    this.isLoginForm = true;
    this.phoneNumber = null;
    this.countryCode = null;
    this.loginWith = 'email';
    this.afterOtpVerified = null;
    this.pageTitle = 'login.pageTitleLoginOrSignUp';
    this.pageTitleShow = true;
    this.welcomeBack = false;
    this.loginForm.reset();
    this.otpSubs.unsubscribe();
    this.photoSubs.unsubscribe();
    this.$loginService.afterOtpVerified.next(null);
    this.$signUpService.isAddProfilePhoto.next(false);
    this.$loginService.welcomeBackFromSignUp.next(null);
    if (this.welcomeBackFromSignUpSubs) {
      this.welcomeBackFromSignUpSubs.unsubscribe();
    }
  }


  // backFromSignUp(event): void {
  //   console.log(event);
  //   if (event) {
  //     this.$loginService.afterOtpVerified.next(
  //       {
  //         isVerified: false,
  //         createAccount: false,
  //       }
  //     );
  //     this.pageTitle = 'login.pageTitleLoginOrSignUp';
  //     this.isBackBtn = false;
  //     this.isEnterOtp = false;
  //     this.isLoginForm = true;
  //     this.loginWith = 'email';
  //     this.loginForm.reset();
  //     this.countryCode = null;
  //     this.phoneNumber = null;
  //   }
  // }


  logInWithGoogle(): void {
    this.$socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      const social_id = user.idToken;
      const social_token = user.authToken;
      const email = user.email;
      const login_type = 'GOOGLE';

      // this.isSubmitting = true;
      this.$loginService.onGoogleLogin({ social_token, social_id, email, login_type }).subscribe(data => {

        if (data.status === 209) {
          this.pageTitle = 'signUp.addYourInfo';
          this.isBackBtn = true;
          this.isCloseBtn = true;
          this.signUpWithGoogle = true;
          this.isLoginForm = false;
          this.email = email;
        }

        if (data.status === 200) {
          console.log(data);
          const token = data.body.data.accessToken.token;
          const user = {
            name: `${data.body.data.user.first_name} ${data.body.data.user.last_name}`,
            profile: data.body.data.user.avatar
          };
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('accessToken', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.$alert.success(data.body.message);
          this.$loginService.isLoggedIn.next(true);
          this.isSubmitting = false;
          this.$dialogRef.close(null);
        }
      }, err => {
        this.isSubmitting = false;
        this.$alert.danger(err.message);
      });
    })
      .catch(err => {
        console.log(err);
      });
  }

}
