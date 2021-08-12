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
import { STEP_14_ROUTE, STEP_12_ROUTE } from '../../constants/route.constant';
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
    phone_number: new FormControl(null, [Validators.required])
  });

  secPhoneNumberForm = new FormGroup({
    country_code: new FormControl('+91'),
    sec_phone_number: new FormControl(null)
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
      'border-radius': '0'
    }
  };
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  otp = '';

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

    this.getUserProfile();
  }

  ngAfterViewInit(): void {
    this.setDataForUpdate();
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
          const {
            country_code = '+91',
            sec_phone_number = ''
          } = this.propertyData.property;

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

      if (this.user.phone_number) {
        this.isOtpVerified = true;
        this.userPhoneNumberForm.setValue({
          country_code: this.user.country_code,
          phone_number: this.user.phone_number
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
    const requestData = this.userPhoneNumberForm.value;
    this.$propertyListingService.resendOtp(requestData).subscribe(res => {
      this.isOtpSend = true;
      console.log(res);
    },
      err => {
        this.$alert.danger(err.message);
      });
  }


  onOtpChange(otp): void {
    this.otp = otp;
    if (this.otp.length === 4) {
      this.updateUserPhoneNumber(this.otp);
    }
  }

  private updateUserPhoneNumber(otp: string): void {
    const requestData = this.userPhoneNumberForm.value;
    requestData.otp = otp;
    this.$propertyListingService.userPhoneNumber(requestData).subscribe(res => {
      const respData = res.data[0];
      this.$alert.success(res.message);
      this.user = respData;
      this.isOtpSend = false;
      this.isOtpVerified = true;
    },
      err => {
        this.$alert.danger(err.message);
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

      this.$router.navigate([this.step14Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
  }


}

