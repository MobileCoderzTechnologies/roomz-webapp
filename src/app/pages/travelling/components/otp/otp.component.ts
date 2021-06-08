import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginService } from 'src/app/pages/login/services/login.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {

  isLoading = false;
  isOtpResending = false;
  otp: number;
  enableOtpBtn = false;

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
    private $dialogRef: MatDialogRef<OtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
  }


  closeDialog(): void {
    this.$dialogRef.close(null);
  }

  onOtpEnter(otp: string): void {
    if (otp.length === 4) {
      this.otp = Number(otp);
      this.enableOtpBtn = true;
    } else {
      this.enableOtpBtn = false;
    }
  }

  verifyOtp(): void {
    this.isLoading = true;
    const verifyOtpData = {
      otp: this.otp,
      phone_number: this.data.phone_number,
      country_code: this.data.country_code,
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
        this.$dialogRef.close(null);
      }

      if (data.status === 209) {
        this.$dialogRef.close({
          isVerified: true,
          phone_number: this.data.phone_number,
          country_code: this.data.country_code,
        });
      }

    }, err => {
      this.isLoading = false;
      this.$alert.danger(err.message);
    });
  }

  resendOtp(): void {
    this.ngOtpInput.setValue(null);
    this.isOtpResending = true;
    this.$loginService.resendOtp({
      phone_number: this.data.phone_number,
      country_code: this.data.country_code
    }).subscribe(data => {
      this.$alert.success(data.message);
      this.isOtpResending = false;
    }, err => {
      this.isOtpResending = false;
      this.$alert.danger(err.message);
    });
  }

}
