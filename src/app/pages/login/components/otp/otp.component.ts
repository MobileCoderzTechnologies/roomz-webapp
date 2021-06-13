import { Component, Inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginService } from 'src/app/pages/login/services/login.service';
import { LoginComponent } from '../../login.component';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit, OnChanges {

  isLoading = false;
  isOtpResending = false;
  otp: number;
  enableOtpBtn = false;
  displayPhoneNumber: string;

  @Input() countryCode: string;
  @Input() phoneNumber: string;
  @ViewChild('ngOtpInput') ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    inputStyles: {
      width: '50px',
      height: '50px'
    }
  };
  constructor(
    private $loginService: LoginService,
    private $alert: AlertService,
    private $dialogRef: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    const lastTwo = this.phoneNumber.slice(-2);
    this.displayPhoneNumber = `${''.padStart(this.phoneNumber.length - 2, 'x')}${lastTwo}`;
  }


  onOtpEnter(otp: string): void {
    if (otp.length === 4) {
      this.otp = Number(otp);
      this.verifyOtp();
    }
  }

  verifyOtp(): void {
    this.isLoading = true;
    const verifyOtpData = {
      otp: this.otp,
      phone_number: this.phoneNumber,
      country_code: this.countryCode,
    };
    this.$loginService.verifyOtp(verifyOtpData).subscribe(data => {
      this.$alert.success(data.body.message);
      if (data.status === 200) {
        const token = data.body.data.accessToken.token;
        localStorage.setItem('accessToken', token);
        const user = {
          name: `${data.body.data.user.first_name} ${data.body.data.user.last_name}`,
          profile: data.body.data.user.avatar
        };
        this.$loginService.isLoggedIn.next(true);
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.$loginService.afterOtpVerified.next(
          {
            isVerified: true,
            createAccount: false,
          }
        );

        this.$dialogRef.close(null);
      }

      if (data.status === 209) {
        this.$loginService.afterOtpVerified.next(
          {
            isVerified: true,
            createAccount: true,
          }
        );
      }

    }, err => {
      this.isLoading = false;
      this.ngOtpInput.setValue(null);
      this.$alert.danger(err.message);
    });
  }

  resendOtp(): void {
    this.ngOtpInput.setValue(null);
    this.isOtpResending = true;
    this.$loginService.resendOtp({
      phone_number: this.phoneNumber,
      country_code: this.countryCode
    }).subscribe(data => {
      this.$alert.success(data.message);
      this.isOtpResending = false;
    }, err => {
      this.isOtpResending = false;
      this.$alert.danger(err.message);
    });
  }

}
