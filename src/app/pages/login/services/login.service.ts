import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccessToken } from 'src/app/modals/accces-token.modal';
import { User } from 'src/app/modals/user.modal';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public afterOtpVerified = new BehaviorSubject<{createAccount: boolean, isVerified: boolean}>(null);

  public isLoggedIn = new BehaviorSubject<boolean>(false);
  constructor(
    private $http: HttpService,
  ) {
    if (localStorage.getItem('accessToken')) {
      this.isLoggedIn.next(true);
    }
  }

  checkAccount(data: any): Observable<any> {
    return this.$http.post('auth/check-account', data, {
      observe: 'response' as 'body'
    });
  }

  resendOtp(data: { phone_number: string, country_code: string }): Observable<
    {
      otpSid: string,
      message: string
    }
  > {
    return this.$http.post('auth/resend-otp', data);
  }

  verifyOtp(data: { phone_number: string, country_code: string, otp: number }): Observable<any> {
    return this.$http.post('auth/verify-otp', data, {
      observe: 'response' as 'body'
    });
  }
  login(data: any): Observable<LoginResp> {
    return this.$http.post('auth/login', data);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    this.isLoggedIn.next(false);
  }
}

interface LoginResp {
  message: string;
  data: {
    user: User;
    accessToken: AccessToken
  };
}
