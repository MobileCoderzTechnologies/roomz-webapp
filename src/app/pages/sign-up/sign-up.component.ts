import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from 'src/app/modals/user.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginService } from '../login/services/login.service';
import { SignUpService } from './services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, AfterViewInit, OnChanges {

  signUpForm: FormGroup = this.$signUpService.signUpForm();
  isSubmitting = false;

  loginType = 'EMAIL';

  minDate: Date;
  maxDate: Date;

  passwordVisible = false;
  confirmPasswordVisible = false;
  passwordError: string = null;

  addProfilePhoto = false;

  @Input() phoneNumber: string;
  @Input() countryCode: string;
  @Input() email: string;
  @Input() logInType: string;
  readonlyEmail = false;

  @Input() dialogRef: any;

  @ViewChild('picker') picker;

  @Output() backToLogin = new EventEmitter();
  constructor(
    private $signUpService: SignUpService,
    private $loginService: LoginService,
    private $alert: AlertService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    const date = new Date();
    const currentYear = date.getTime();
    this.maxDate = new Date(currentYear - (13 * 365 * 24 * 60 * 60 * 1000) - (3 * 24 * 60 * 60 * 1000));


  }

  ngOnInit(): void {
    // console.log(this.data);
  }

  ngAfterViewInit(): void {

  }

  ngOnChanges(): void {
    if (this.email) {
      this.signUpForm.controls.email.setValue(this.email);
      this.readonlyEmail = true;
    }
  }

  spaceRequiredError(fieldName: string, value: string): void {
    value = value.trim();
    if (!value) {
      this.signUpForm.controls[fieldName].setErrors({ required: true });
    }
  }

  openCalender(): void {
    this.picker.open();
  }


  ageValidation(): void {
    const control = this.signUpForm.controls.dob;
    const tDate = Date.now();
    if (control.value) {
      const inputDate = new Date(control.value);
      const minDob = new Date(tDate - 18 * 1000 * 24 * 60 * 60 * 365);
      const year = inputDate.getFullYear();
      if (`${year}`.length !== 4) {
        const errorObj = {
          age: true,
          minDob
        };
        control.setErrors(errorObj);
        return;
      }
      const userDateTime = inputDate.getTime();
      let ageDiff = tDate - userDateTime;
      ageDiff = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365));
      console.log(ageDiff);
      const ageDiffShouldBe = 18;

      if (ageDiff > ageDiffShouldBe) {
        control.setErrors(null);
      } else {
        const errorObj = {
          age: true,
          minDob
        };
        control.setErrors(errorObj);
      }
    }
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
    if (this.phoneNumber) {
      userData.phone_number = this.phoneNumber;
      userData.country_code = this.countryCode;
    }
    this.register(userData);

  }
  register(userData: User): void {
    this.isSubmitting = true;
    const date = new Date(userData.dob);
    userData.dob = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
    if (this.logInType) {
      this.loginType = this.logInType;
    }
    userData.login_type = this.loginType;
    console.log(userData);
    this.$signUpService.register(userData).subscribe(data => {

      if (data.status === 202) {
        this.$alert.info('Account already exists with this email, please login');
        this.$loginService.welcomeBackFromSignUp.next({
          back: true,
          email: data.body.email,
          message: data.body.message
        });
        this.isSubmitting = false;
      }
      if (data.status === 200) {
        const token = data.body.data.accessToken.token;
        const user = {
          name: `${data.body.data.user.first_name} ${data.body.data.user.last_name}`,
          profile: data.body.data.user.avatar
        };
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('accessToken', token);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.$loginService.isLoggedIn.next(true);
        this.isSubmitting = false;
        this.$alert.success(data.message);
        this.$signUpService.isAddProfilePhoto.next(true);
        this.addProfilePhoto = true;
      }
    }, err => {
      this.isSubmitting = false;
      this.$alert.danger(err.message);
    });
  }


  onClickLogin(): void {
    this.backToLogin.emit({
      email: this.email,
      phoneNumber: this.phoneNumber,
      countryCode: this.countryCode
    });
  }


}
