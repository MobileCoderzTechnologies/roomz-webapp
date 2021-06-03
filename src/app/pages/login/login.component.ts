import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginWith = 'phone';
  loginForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
    email: new FormControl(null),
    password: new FormControl(null, Validators.required)
  });
  isSubmitting = false;
  constructor(
    private $loginService: LoginService,
    private $dialogRef: MatDialogRef<LoginComponent>,
    private $alert: AlertService,
  ) { }

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
    }

    if (loginType === 'phone') {
      this.loginForm.controls.email.clearValidators();
      this.loginForm.controls.email.setValidators(null);
      this.loginForm.controls.email.setErrors(null);
      this.loginForm.controls.phoneNumber.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
    }
  }

  onSubmit(): void {
    console.log(this.loginForm);
    const loginData = this.loginForm.value;
    this.checkAccount(loginData);
  }

  private checkAccount(loginData: any): void {
    this.isSubmitting = true;
    loginData.login_type = this.loginWith.toUpperCase();
    this.$loginService.checkAccount(loginData).subscribe(data => {
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
    this.$loginService.login(loginData).subscribe(data => {
      const token = data.data.accessToken.token;
      localStorage.setItem('accessToken', token);
      this.$alert.success(data.message);
      this.$loginService.isLoggedIn.next(true);
      this.isSubmitting = false;
    }, err => {
      this.isSubmitting = false;
      this.$alert.danger(err.message);
    });
  }

}
