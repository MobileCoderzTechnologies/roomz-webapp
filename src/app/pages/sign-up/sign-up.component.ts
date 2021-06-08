import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LOWERCASE, NUMBERS, UPPERCASE } from 'src/app/constants/regex.constant';
import { User } from 'src/app/modals/user.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginService } from '../login/services/login.service';
import { SignUpService } from './services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, AfterViewInit {

  signUpForm: FormGroup = this.$signUpService.signUpForm();
  isSubmitting = false;

  loginType = 'EMAIL';
  minDate: Date;
  maxDate: Date;

  passwordVisible = false;
  passwordError: string = null;

  constructor(
    private $signUpService: SignUpService,
    private $loginService: LoginService,
    private $dialogRef: MatDialogRef<SignUpComponent>,
    private $alert: AlertService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    const date = new Date();
    const currentYear = date.getTime();
    this.maxDate = new Date(currentYear - (13 * 365 * 24 * 60 * 60 * 1000) - (3 * 24 * 60 * 60 * 1000));
    if (data && data.email) {
      this.loginType = data.loginType;
      console.log(data.email);
      this.signUpForm.controls.email.setValue(data.email);
    }
  }

  ngOnInit(): void {
    // console.log(this.data);
  }

  ngAfterViewInit(): void {

  }

  closeDialog(): void {
    this.$dialogRef.close(null);
  }

  // passwordPatternError(password): void {
  //   // const password: string = this.signUpForm.controls.password.value;
  //   console.log(password);
  //   if (!NUMBERS.test(password)) {
  //     this.passwordError = 'validateErrorMessages.passwordPatternNumber';
  //   }
  //   else if (!LOWERCASE.test(password)) {
  //     this.passwordError = 'validateErrorMessages.passwordPatternLowerCase';
  //   }
  //   else if (!UPPERCASE.test(password)) {
  //     this.passwordError = 'validateErrorMessages.passwordPatternUpperCase';
  //   }
  //   else {
  //     this.passwordError = 'validateErrorMessages.passwordPatternSpecialCharacters';
  //   }

  // }


  onSubmit(): void {
    const userData = this.signUpForm.value;
    if (this.data && this.data.createAccount) {
      if (this.data.phone_number) {
        userData.phone_number = this.data.phone_number;
        userData.country_code = this.data.country_code;
      }
      this.register(userData);
    } else {
      this.checkAccount(userData);
    }
  }

  private checkAccount(userData: any): void {
    this.isSubmitting = true;
    userData.login_type = this.loginType;
    this.$loginService.checkAccount(
      {
        login_type: this.loginType,
        email: userData.email
      }
    ).subscribe(data => {
      if (data.status === 202) {
        this.$alert.info(data.body.message, 5000);
        this.$dialogRef.close(
          {
            login: true,
            email: userData.email,
            loginType: this.loginType,
            checkAccount: true
          }
        );
      }

      if (data.status === 209) {
        this.register(userData);
      }
    }, err => {
      this.isSubmitting = false;
      this.$alert.danger(err.message);
    });
  }

  register(userData: User): void {
    this.isSubmitting = true;
    const date = new Date(userData.dob);
    userData.dob = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
    userData.login_type = this.loginType;
    console.log(userData);
    this.$signUpService.register(userData).subscribe(data => {
      const token = data.data.accessToken.token;
      localStorage.setItem('accessToken', token);
      const user = {
        name: `${data.data.user.first_name} ${data.data.user.last_name}`,
        profile: data.data.user.avatar
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.$loginService.isLoggedIn.next(true);
      this.isSubmitting = false;
      this.$alert.success(data.message);
      this.closeDialog();
    }, err => {
      this.isSubmitting = false;
      this.$alert.danger(err.message);
    });
  }


  onLogin(): void {
    this.$dialogRef.close({
      login: true,
      checkAccount: false
    });
  }

}
