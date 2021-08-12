import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ADVANCE_NOTICE, AVAILABILITY_WINDOW, CHECK_IN_TIMES, SAME_DAY_CUT_OFF_TIME } from 'src/app/constants/availability.constant';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_15_ROUTE, STEP_13_ROUTE, STEP_16_ROUTE, STEP_21_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests23',
  templateUrl: './property-guests23.component.html',
  styleUrls: ['./property-guests23.component.scss']
})
export class PropertyGuests23Component implements OnInit, AfterViewInit, OnDestroy {

  step16Route = STEP_16_ROUTE;
  step13Route = STEP_13_ROUTE;

  step21Route = STEP_21_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  advanceNotice = ADVANCE_NOTICE;

  sameDayCutOff = SAME_DAY_CUT_OFF_TIME;
  checkInTimes = CHECK_IN_TIMES;
  availabilityWindow = AVAILABILITY_WINDOW;

  selectedAdvanceNotice = 0;
  selectedCutOffTime = 22;
  selectedAvailabilityWindow = 1;

  selectedCiArriveAfter = 10;
  selectedCiArriveBefore = 22;
  selectedCiLeaveBefore = 12;

  tripLengthMin = [];
  tripLengthMax = [];

  selectedTripMin = 1;
  selectedTripMax = this.selectedTripMin;


  availabilityForm = new FormGroup({
    advance_notice: new FormControl(this.selectedAdvanceNotice),
    cut_off_time: new FormControl(this.selectedCutOffTime),
    guests_book_time: new FormControl(this.selectedAvailabilityWindow),
    ci_arrive_after: new FormControl(this.selectedCiArriveAfter),
    ci_arrive_before: new FormControl(this.selectedCiArriveBefore),
    ci_leave_before: new FormControl(this.selectedCiLeaveBefore),
  });

  isBack21 = false;

  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $router: Router,
    private $activatedRoute: ActivatedRoute,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService,
  ) {
    for (let i = 1; i <= 30; i++) {
      this.tripLengthMin.push(i);
    }
    this.setMaxTrip();
  }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 70,
      heading: 'Property and guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.$activatedRoute.queryParams.subscribe(data => {
      const back = data?.back;
      if (Number(back) === 21) {
        this.isBack21 = true;
      }
    });

  }

  private setMaxTrip(): void {
    for (let i = this.selectedTripMin; i <= 120; i++) {
      this.tripLengthMax.push(i);
    }
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
            advance_notice = this.selectedAdvanceNotice,
            cut_off_time = this.selectedCutOffTime,
            guests_book_time = this.selectedAvailabilityWindow,
            ci_arrive_after = this.selectedCiArriveAfter,
            ci_arrive_before = this.selectedCiArriveBefore,
            ci_leave_before = this.selectedCiLeaveBefore,
            min_stay = this.selectedTripMin,
            max_stay = this.selectedTripMax
          } = this.propertyData.property;


          this.selectedAdvanceNotice = advance_notice;
          this.selectedCutOffTime = cut_off_time;
          this.selectedAvailabilityWindow = guests_book_time;
          this.selectedCiArriveAfter = ci_arrive_after;
          this.selectedCiArriveBefore = ci_arrive_before;
          this.selectedCiLeaveBefore = ci_leave_before;
          this.selectedTripMin = min_stay;
          this.selectedTripMax = max_stay;

          this.availabilityForm.setValue({
            advance_notice,
            cut_off_time,
            guests_book_time,
            ci_arrive_after,
            ci_arrive_before,
            ci_leave_before
          });
        }

      });
  }

  onSelectTripLengthMin(l: number): void {
    this.selectedTripMin = Number(l);
    this.tripLengthMax = [];
    this.setMaxTrip();
  }

  onSelectTripLengthMax(l: number): void {
    this.selectedTripMax = Number(l);
  }


  setPropertyAvailability(): void {
    this.isNextLoading = true;
    const requestData = this.availabilityForm.value;

    requestData.min_stay = this.selectedTripMin;
    requestData.max_stay = this.selectedTripMax;

    this.$propertyListingService.addSecPropertyAvailability(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.max_stay = respData.max_stay;
      this.propertyData.property.min_stay = respData.min_stay;
      this.propertyData.property.advance_notice = respData.advance_notice;
      this.propertyData.property.cut_off_time = respData.cut_off_time;
      this.propertyData.property.guests_book_time = respData.guests_book_time;
      this.propertyData.property.ci_arrive_after = respData.ci_arrive_after;
      this.propertyData.property.ci_arrive_before = respData.ci_arrive_before;
      this.propertyData.property.ci_leave_before = respData.ci_leave_before;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;

      this.$router.navigate([this.step16Route.url, this.encryptedPropertyId]);
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
