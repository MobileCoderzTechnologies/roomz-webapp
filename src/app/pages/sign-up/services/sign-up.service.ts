import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccessToken } from 'src/app/modals/accces-token.modal';
import { User } from 'src/app/modals/user.modal';
import { HttpService } from 'src/app/services/http.service';
import { matchPasswords } from 'src/app/validators/password.validator';
import { ageValidator } from 'src/app/validators/age.validator';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(
    private $http: HttpService,
    private $fb: FormBuilder
  ) { }

  signUpForm(): FormGroup {
    // tslint:disable-next-line: deprecation
    return this.$fb.group({
      phone_number: [null, [Validators.minLength(10), Validators.maxLength(10)]],
      country_code: [null],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      email: [null, [Validators.email]],
      password: [null, Validators.required],
      confirm_password: [null, Validators.required],
      dob: [null, [Validators.required]]
    },
      { validators: [matchPasswords('password', 'confirm_password')] }
    );
  }


  checkAccount(data: any): Observable<
    {
      otpSid: string;
      message: string;
      email: string
    }
  > {
    return this.$http.post('auth/check_account', data);
  }

  register(data: any): Observable<SignUpResp> {
    return this.$http.post('auth/register', data);
  }

  resendOtp(data: { phone_number: string, country_code: string }): Observable<
    {
      otpSid: string,
      message: string
    }
  > {
    return this.$http.post('auth/resend_otp', data);
  }

  verifyOtp(data: { phone_number: string, country_code: string, otp: number }): Observable<
    {
      status: string,
      message: string
    }
  > {
    return this.$http.post('auth/verify_otp', data);
  }
}
interface SignUpResp {
  message: string;
  data: {
    user: User;
    accessToken: AccessToken
  };
}
