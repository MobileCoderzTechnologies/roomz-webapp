import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  constructor(
    private $loginService: LoginService
  ) { }

  ngOnInit(): void {

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
  }

}
