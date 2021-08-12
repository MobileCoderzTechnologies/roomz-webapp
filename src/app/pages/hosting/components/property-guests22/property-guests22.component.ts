import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_21_ROUTE, STEP_5_ROUTE, STEP_7_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';
import { GuestRequirementModelComponent } from '../guest-requirement-model/guest-requirement-model.component';

@Component({
  selector: 'app-property-guests22',
  templateUrl: './property-guests22.component.html',
  styleUrls: ['./property-guests22.component.scss']
})
export class PropertyGuests22Component implements OnInit, AfterViewInit, OnDestroy {

  step7Route = STEP_7_ROUTE;
  step5Route = STEP_5_ROUTE;

  step21Route = STEP_21_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  isIdSubmitted = false;
  isEmailConfirmed = true;
  isPhoneConfirmed = false;
  isPaymentInformation = false;
  isTripPurpose = false;
  isAgreeHR = false;
  isRecommendedFromOH = false;

  isBack21 = false;

  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $router: Router,
    private $activatedRoute: ActivatedRoute,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService,
    private $dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 35,
      heading: 'Property and guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.$activatedRoute.queryParams.subscribe(data => {
      const back = data.back;
      if (Number(back) === 21) {
        this.isBack21 = true;
      }
    });
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
          this.isAgreeHR = this.propertyData.property.is_agree_hr || true;
          this.isEmailConfirmed = this.propertyData.property.is_email_confirmation || true;
          this.isPaymentInformation = this.propertyData.property.is_payment_information || true;
          this.isPhoneConfirmed = this.propertyData.property.is_phone_confirmed || false;
          this.isIdSubmitted = this.propertyData.property.is_id_submitted || false;
          this.isRecommendedFromOH = this.propertyData.property.is_recommended_from_oh || false;
          this.isTripPurpose = this.propertyData.property.is_trip_purpose || false;
        }
      });
  }

  editRequirements(): void {
    const data = {
      isPaymentInformation: this.isPaymentInformation,
      isEmailConfirmed: this.isEmailConfirmed,
      isPhoneConfirmed: this.isPhoneConfirmed,
      isRecommendedFromOH: this.isRecommendedFromOH,
      isIdSubmitted: this.isIdSubmitted,
      isTripPurpose: this.isTripPurpose,
      isAgreeHR: this.isAgreeHR,
    };
    const dialogRef = this.$dialog.open(GuestRequirementModelComponent, {
      height: 'auto',
      width: 'auto',
      maxHeight: '90vh',
      data
    });

    dialogRef.afterClosed().subscribe(dialogData => {
      if (dialogData) {
        this.isPaymentInformation = dialogData.isPaymentInformation;
        this.isEmailConfirmed = dialogData.isEmailConfirmed;
        this.isPhoneConfirmed = dialogData.isPhoneConfirmed;
        this.isRecommendedFromOH = dialogData.isRecommendedFromOH;
        this.isIdSubmitted = dialogData.isIdSubmitted;
        this.isTripPurpose = dialogData.isTripPurpose;
        this.isAgreeHR = dialogData.isAgreeHR;
      }
    });
  }

  addGuestRequirements(): void {
    this.isNextLoading = true;

    const requestData = {
      is_email_confirmed: this.isEmailConfirmed,
      is_phone_confirmed: this.isPhoneConfirmed,
      is_payment_information: this.isPaymentInformation,
      is_agree_hr: this.isAgreeHR,
      is_trip_purpose: this.isTripPurpose,
      is_id_submitted: this.isIdSubmitted,
      is_recommended_from_oh: this.isRecommendedFromOH
    };

    this.$propertyListingService.addGuestRequirements(this.propertyId, requestData).subscribe(data => {
      this.isNextLoading = false;
      const respData = data.data[0];

      this.propertyData.property.is_email_confirmed = respData.is_email_confirmed;
      this.propertyData.property.is_phone_confirmed = respData.is_phone_confirmed;
      this.propertyData.property.is_payment_information = respData.is_payment_information;
      this.propertyData.property.is_agree_hr = respData.is_agree_hr;
      this.propertyData.property.is_trip_purpose = respData.is_trip_purpose;
      this.propertyData.property.is_id_submitted = respData.is_id_submitted;
      this.propertyData.property.is_recommended_from_oh = respData.is_recommended_from_oh;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);

      this.$router.navigate([this.step7Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }

  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
    this.isBack21 = false;
  }
}
