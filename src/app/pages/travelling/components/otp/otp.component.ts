import { Component, Inject, OnInit } from '@angular/core';
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
  constructor(
    private $loginService: LoginService,
    private $alert: AlertService,
    private $dialogRef: MatDialogRef<OtpComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
  }

  private verifyOtp(otp: number): void {
    this.isLoading = true;
    const verifyOtpData = {
      otp,
      phone_number: this.data.phone_number,
      country_code: this.data.country_code,
    };
    this.$loginService.verifyOtp(verifyOtpData).subscribe(data => {
      this.$alert.success(data.message);
      this.$dialogRef.close({
        isVerified: true,
        phone_number: this.data.phone_number,
        country_code: this.data.country_code,
      });
    }, err => {
      this.isLoading = false;
      this.$alert.danger(err.message);
    });
  }

  resendOtp(): void {
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
