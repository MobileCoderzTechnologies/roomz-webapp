import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pipe, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { COUNTRIES_CODES } from 'src/app/constants/country-code.constant';
import { EMAIL_REGEX, PASSWORD } from 'src/app/constants/regex.constant';
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

  countryCodes = COUNTRIES_CODES;
  constructor(
    private $loginService: LoginService,
    private $signUpService: SignUpService,
    public $dialogRef: MatDialogRef<LoginComponent>,
    private $alert: AlertService,
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
  }

  closeDialog(): void {
    this.$dialogRef.close(null);
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
      this.$alert.info(data.body.message);

      this.isSubmitting = false;
    }, err => {
      this.isSubmitting = false;
      console.log(err);
      this.$alert.danger(err.message);
    });
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
    this.afterOtpVerified = { createAccount: false, isVerified: false };
    this.pageTitle = 'login.pageTitleLoginOrSignUp';
    this.pageTitleShow = true;
    this.welcomeBack = false;
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

}
