import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginService } from 'src/app/pages/login/services/login.service';
import { LoginComponent } from '../../login.component';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit, OnChanges, AfterViewInit {

  isLoading = false;
  isOtpResending = false;
  otp: number;
  enableOtpBtn = false;
  displayPhoneNumber: string;
  timerTime = 30;
  isTimerShow = true;
  timerSubs: Subscription;

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
    private $dialogRef: MatDialogRef<LoginComponent>,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.timerStart();
  }

  ngOnChanges(): void {
    const lastTwo = this.phoneNumber.slice(-2);
    this.displayPhoneNumber = `${''.padStart(this.phoneNumber.length - 2, 'x')}${lastTwo}`;
  }

  private timerStart(): void {
    this.isTimerShow = true;
    this.timerTime = 30;
    this.ngOtpInput.otpForm.enable();
    this.timerSubs = interval(1000)
      .pipe(
        delay(0)
      )
      .subscribe(() => {
        this.timerTime--;
        if (this.timerTime < 1) {
          this.timerSubs.unsubscribe();
          this.isTimerShow = false;
          this.ngOtpInput.otpForm.disable();
        }
      });
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
    this.ngOtpInput.otpForm.disable();
    this.config.disableAutoFocus = true;
    this.$loginService.verifyOtp(verifyOtpData).subscribe(data => {
      this.$alert.success(data.body.message);
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
      this.ngOtpInput.otpForm.enable();
      this.config.disableAutoFocus = false;
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
      this.timerStart();
      this.isOtpResending = false;
    }, err => {
      this.isOtpResending = false;
      this.$alert.danger(err.message);
    });
  }

}
