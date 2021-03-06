import { ViewChild } from '@angular/core';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { request } from 'express';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { COUNTRIES_CODES } from 'src/app/constants/country-code.constant';
import { User } from 'src/app/modals/user.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_14_ROUTE, STEP_12_ROUTE, MY_LISTING_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests15',
  templateUrl: './property-guests15.component.html',
  styleUrls: ['./property-guests15.component.scss']
})
export class PropertyGuests15Component implements OnInit, AfterViewInit, OnDestroy {

  step14Route = STEP_14_ROUTE;
  step12Route = STEP_12_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  user: User;

  userPhoneNumberForm = new FormGroup({
    country_code: new FormControl('+91'),
    phone_number: new FormControl('', [Validators.minLength(9), Validators.maxLength(14), Validators.required])
  });

  secPhoneNumberForm = new FormGroup({
    country_code: new FormControl('+966'),
    sec_phone_number: new FormControl('', [Validators.minLength(9), Validators.maxLength(14)])
  });

  isOtpSend = false;
  isOtpVerified = false;
  countryCodes = COUNTRIES_CODES;

  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '60px',
      'height': '50px',
      'border': 'none',
      'border-bottom': '1px solid',
      'border-radius': '0',
      'outline': 'none'
    }
  };
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  otp = '';
  displayPhoneNumber = '';
  isOtpSubmitting = false;
  isOtpSending = false;
  isSavingExit = false;
  saveExitSubs: Subscription;

  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $router: Router,
    private $activatedRoute: ActivatedRoute,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService,
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 65,
      heading: 'Property and guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.saveExitSubs = this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.isSavingExit = true;
        if (this.userPhoneNumberForm.valid && !this.isOtpVerified) {
          this.$ps.isSaveExit.next(false);
          this.$alert.danger('Please Verify Phone Number');
        }
        else if (this.userPhoneNumberForm.valid && this.isOtpVerified) {
          this.addSecPhoneNumber();
        }
        else {
          this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        }
      }
    });

    this.getUserProfile();
  }

  ngAfterViewInit(): void {
    this.setDataForUpdate();

    this.userPhoneNumberForm.controls.phone_number.valueChanges.subscribe(data => {
      this.isOtpSend = false;
    });
  }



  private setDataForUpdate(): void {
    this.propertyDataSubs = this.$ps.propertyData
      .pipe(
        delay(0)
      )
      .subscribe(data => {
        this.propertyData = data;
        console.log(this.propertyData);
        if (this.propertyData) {
          let {
            country_code = '+966',
            sec_phone_number = ''
          } = this.propertyData.property;

          country_code = country_code || '+966';
          sec_phone_number = sec_phone_number || '';
          this.secPhoneNumberForm.setValue({
            country_code,
            sec_phone_number
          });
        }
      });
  }


  private getUserProfile(): void {
    this.$propertyListingService.getUser().subscribe(data => {
      const respData = data.data[0];
      this.user = respData;

      if (this.user.phone_number && this.user.phone_number !== 'null') {
        this.isOtpVerified = true;
        const country_code = this.user.country_code || '+966';
        const phone_number = this.user.phone_number || '';
        this.userPhoneNumberForm.setValue({
          country_code,
          phone_number
        });
      }
    }, err => {
      this.$alert.danger(err.message);
    });
  }


  onPhoneNumberChange(phoneNumber: string): void {
    if (this.user.phone_number === phoneNumber) {
      this.isOtpVerified = true;
    }
    else {
      this.isOtpVerified = false;
    }
  }
  sendOtp(): void {
    this.isOtpSending = true;
    const requestData = this.userPhoneNumberForm.value;
    this.$propertyListingService.resendOtp(requestData).subscribe(res => {
      this.isOtpSend = true;
      this.$alert.success(res.message);
      const phoneNumber = this.userPhoneNumberForm.controls.phone_number.value;
      const lastTwo = phoneNumber.slice(-2);
      this.displayPhoneNumber = `${''.padStart(phoneNumber.length - 2, 'x')}${lastTwo}`;
      this.isOtpSending = false;
    },
      err => {
        this.$alert.danger(err.message);
        this.isOtpSending = false;
      });
  }


  onOtpChange(otp): void {
    this.otp = otp;
    if (this.otp.length === 4) {
      this.updateUserPhoneNumber(this.otp);
    }
  }

  private updateUserPhoneNumber(otp: string): void {
    this.isOtpSubmitting = true;
    const requestData = this.userPhoneNumberForm.value;
    requestData.otp = otp;
    this.$propertyListingService.userPhoneNumber(requestData).subscribe(res => {
      const respData = res.data[0];
      this.$alert.success(res.message);
      this.user = respData;
      this.isOtpSend = false;
      this.isOtpVerified = true;
      this.isOtpSubmitting = false;
    },
      err => {
        this.isOtpSubmitting = false;
        this.ngOtpInput.setValue(null);
        this.$alert.danger(err.message);
        this.ngOtpInput.otpForm.enable();
        this.config.disableAutoFocus = true;
      });
  }


  addSecPhoneNumber(): void {
    this.isNextLoading = true;
    const requestData = this.secPhoneNumberForm.value;



    this.$propertyListingService.addSecPhoneNumber(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.country_code = respData.country_code;
      this.propertyData.property.sec_phone_number = respData.sec_phone_number;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;

      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }

      this.$router.navigate([this.step14Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
      this.$ps.isSaveExit.next(false);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
    this.saveExitSubs.unsubscribe();
  }


}

