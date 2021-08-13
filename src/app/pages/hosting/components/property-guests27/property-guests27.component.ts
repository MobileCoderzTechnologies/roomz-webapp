import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ADVANCE_NOTICE, AVAILABILITY_WINDOW } from 'src/app/constants/availability.constant';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_14_ROUTE, STEP_16_ROUTE, STEP_20_ROUTE, STEP_22_ROUTE, STEP_6_ROUTE, STEP_7_ROUTE, STEP_9_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests27',
  templateUrl: './property-guests27.component.html',
  styleUrls: ['./property-guests27.component.scss']
})
export class PropertyGuests27Component implements OnInit, AfterViewInit, OnDestroy {

  step22Route = STEP_22_ROUTE;
  step20Route = STEP_20_ROUTE;

  step9Route = STEP_9_ROUTE;
  step6Route = STEP_6_ROUTE;
  step7Route = STEP_7_ROUTE; // house rule

  step14Route = STEP_14_ROUTE; // availability
  step16Route = STEP_16_ROUTE; // pricing

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  property: any;

  advanceNotice = ADVANCE_NOTICE;
  futureReservation = AVAILABILITY_WINDOW;

  additionalPriceForm = new FormGroup({
    monthly_discount: new FormControl(0, Validators.min(0)),
    weekly_discount: new FormControl(0, Validators.min(0)),
  });

  additionalPriceData = {
    monthly_discount: 0,
    weekly_discount: 0
  };


  coverImage = '';
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
      progress: 97,
      heading: 'Calendar and availability'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.getPropertyDetails();

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
            weekly_discount = 0,
            monthly_discount = 0,
          } = this.propertyData.property;

          this.additionalPriceForm.setValue({
            monthly_discount,
            weekly_discount
          });

        }

      });
  }


  saveAdditionalData(): void {
    this.additionalPriceData = this.additionalPriceForm.value;
  }

  private getPropertyDetails(): void {
    this.$propertyListingService.getPropertyPreview(this.propertyId).subscribe(data => {
      this.property = data.data[0];
      console.log(this.property);
      const coverPhoto = this.property.cover_photo.split('/');
      coverPhoto.pop();
      this.coverImage = `${coverPhoto.join('/')}/576x250.jpeg`;
    },
      err => {
        this.$alert.danger(err.message);
      });
  }


  onNext(): void {
    this.isNextLoading = true;
    const requestData = this.additionalPriceData;

    this.$propertyListingService.setLongTermDiscounts(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.monthly_discount = respData.monthly_discount;
      this.propertyData.property.weekly_discount = respData.weekly_discount;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;

      this.$router.navigate([this.step22Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }




  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
  }

}
