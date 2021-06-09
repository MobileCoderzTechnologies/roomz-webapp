import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PASSWORD } from 'src/app/constants/regex.constant';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginWith = 'email';
  loginForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl(null, [Validators.maxLength(8), Validators.minLength(15)]),
    countryCode: new FormControl(null),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(19), Validators.pattern(PASSWORD)])
  });
  isSubmitting = false;

  countryCodes = ['+966', '+91', '+242', '+20', '+216'];
  constructor(
    private $loginService: LoginService,
    private $dialogRef: MatDialogRef<LoginComponent>,
    private $alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data && data.login && data.email) {
      this.loginWith = data.loginType.toLowerCase();
      // this.onClickLoginWith(this.loginWith);
      this.loginForm.controls.email.setValue(data.email);
    }
  }

  ngOnInit(): void {

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
      this.loginForm.controls.password.setValidators(
        [Validators.required,
        Validators.minLength(8),
        Validators.maxLength(19),
        Validators.pattern(PASSWORD)
        ]
      );
    }

    if (loginType === 'phone') {
      this.loginForm.controls.email.clearValidators();
      this.loginForm.controls.email.setValidators(null);
      this.loginForm.controls.email.setErrors(null);
      this.loginForm.controls.password.clearValidators();
      this.loginForm.controls.password.setValidators(null);
      this.loginForm.controls.password.setErrors(null);
      this.loginForm.controls.phoneNumber.setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(14)]);
      this.loginForm.controls.countryCode.setValidators(Validators.required);
      this.loginForm.controls.countryCode.setValue('+966');
    }
  }

  onSubmit(): void {
    console.log(this.loginForm);
    const loginData = this.loginForm.value;
    if (loginData.phoneNumber) {
      loginData.phone_number = loginData.phoneNumber;
      loginData.country_code = loginData.countryCode;
      delete loginData.phoneNumber;
    }
    if (this.data && this.data.login) {
      this.login(loginData);
    } else {
      this.checkAccount(loginData);
    }
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
        password: loginData.password,
        login_type: loginData.login_type,
      };
    }
    this.$loginService.checkAccount(checkData).subscribe(data => {
      if (data.status === 200) {
        this.$dialogRef.close(
          {
            createAccount: true,
            phone_number: loginData.phone_number,
            country_code: loginData.country_code,
            loginType: this.loginWith.toUpperCase(),
            checkAccount: true,
            message: data.body.message
          }
        );
      }
      if (data.status === 202) {
        // this.$alert.success(data.body.message);
        this.login(loginData);
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
    this.$dialogRef.close(
      {
        createAccount: true,
        checkAccount: false
      }
    );
  }

}
