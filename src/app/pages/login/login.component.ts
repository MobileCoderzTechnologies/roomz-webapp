import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pipe, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PASSWORD } from 'src/app/constants/regex.constant';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  pageTitle = 'login.pageTitleLoginOrSignUp';
  isBackBtn = false;
  isCloseBtn = true;
  isEnterOtp = false;
  isLoginForm = true;

  phoneNumber: string;
  countryCode: string;
  loginWith = 'email';

  afterOtpVerified = { createAccount: false, isVerified: false };
  otpSubs: Subscription;
  loginForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl(null, [Validators.maxLength(8), Validators.minLength(15)]),
    countryCode: new FormControl(null),
    email: new FormControl(null, [Validators.required, Validators.email]),
  });
  isSubmitting = false;

  countryCodes = [
    {
      name: 'India',
      code: '+91'
    },
    {
      name: 'Saudi Arabia',
      code: '+966'
    }
  ];
  constructor(
    private $loginService: LoginService,
    private $dialogRef: MatDialogRef<LoginComponent>,
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
            this.isCloseBtn = true;
          } else {
            this.isCloseBtn = true;
            this.isEnterOtp = false;
            this.loginForm.reset();
          }
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
      this.loginForm.controls.email.setValidators([Validators.required, Validators.email]);
      this.loginForm.controls.phoneNumber.clearValidators();
      this.loginForm.controls.phoneNumber.setValidators(null);
      this.loginForm.controls.phoneNumber.setErrors(null);
      this.loginForm.controls.countryCode.clearValidators();
      this.loginForm.controls.countryCode.setValidators(null);
      this.loginForm.controls.countryCode.setErrors(null);
      // this.loginForm.controls.password.setValidators(
      //   [Validators.required,
      //   Validators.minLength(8),
      //   Validators.maxLength(19),
      //   Validators.pattern(PASSWORD)
      //   ]
      // );
    }

    if (loginType === 'phone') {
      this.loginForm.controls.email.clearValidators();
      this.loginForm.controls.email.setValidators(null);
      this.loginForm.controls.email.setErrors(null);
      this.loginForm.controls.phoneNumber.setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(14)]);
      this.loginForm.controls.countryCode.setValidators(Validators.required);
      this.loginForm.controls.countryCode.setValue('+966');
    }
  }

  onSubmit(): void {
    const loginData = this.loginForm.value;
    if (loginData.phoneNumber) {
      loginData.phone_number = loginData.phoneNumber;
      loginData.country_code = loginData.countryCode;
      delete loginData.phoneNumber;
      delete loginData.email;
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
        this.isLoginForm = false;
        this.phoneNumber = checkData.phone_number;
        this.countryCode = checkData.country_code;
      }
      if (data.status === 202) {
        // this.login(loginData);
      }

      if (data.status === 209) {
        this.$dialogRef.close(
          {
            createAccount: true,
            email: loginData.email,
            loginType: this.loginWith.toUpperCase(),
            checkAccount: true,
          }
        );
        this.$alert.info(data.body.message, 5000);
      }

      this.isSubmitting = false;
    }, err => {
      this.isSubmitting = false;
      this.$alert.danger(err.message);
    });
  }



  private login(loginData: any): void {
    let lData;
    if (loginData.country_code) {
      lData = {
        country_code: loginData.country_code,
        phone_number: loginData.phone_number,
        // login_type: loginData.login_type,
      };
    }

    if (loginData.email) {
      lData = {
        email: loginData.email,
        password: loginData.password,
        // login_type: loginData.login_type,
      };
    }
    this.$loginService.login(lData).subscribe(data => {
      const token = data.data.accessToken.token;
      localStorage.setItem('accessToken', token);
      const user = {
        name: `${data.data.user.first_name} ${data.data.user.last_name}`,
        profile: data.data.user.avatar
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.$alert.success(data.message);
      this.$loginService.isLoggedIn.next(true);
      this.isSubmitting = false;
      this.closeDialog();
    }, err => {
      this.isSubmitting = false;
      this.$alert.danger(err.message);
    });
  }


  onSignUp(): void {

  }


  backFromOtp(): void {
    this.isCloseBtn = true;
    this.isEnterOtp = false;
    this.isLoginForm = true;
    this.loginForm.reset();
    this.loginForm.controls.countryCode.setValue(this.countryCode);
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
