import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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
  passwordError: string = null;

  @Input() phoneNumber: string;
  @Input() countryCode: string;
  @Input() email: string;
  readonlyEmail = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onLogin = new EventEmitter<boolean>();

  constructor(
    private $signUpService: SignUpService,
    private $loginService: LoginService,
    private $alert: AlertService,
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
    }, err => {
      this.isSubmitting = false;
      this.$alert.danger(err.message);
    });
  }


  onClickLogin(): void {
    console.log('onClickLogin');
    this.onLogin.emit(true);
  }

}
