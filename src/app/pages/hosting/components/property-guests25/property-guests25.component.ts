import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_14_ROUTE, STEP_17_ROUTE, STEP_21_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests25',
  templateUrl: './property-guests25.component.html',
  styleUrls: ['./property-guests25.component.scss']
})
export class PropertyGuests25Component implements OnInit, AfterViewInit, OnDestroy {
  step17Route = STEP_17_ROUTE;
  step14Route = STEP_14_ROUTE;

  step21Route = STEP_21_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  basePrice = new FormControl(1, [Validators.required, Validators.min(1), Validators.max(999999)]);

  discountPercent = new FormControl(0, [Validators.required, Validators.max(90), Validators.min(0)])
  isDiscount20 = true;

  isBack21 = false;

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
    this.$activatedRoute.queryParams.subscribe(data => {
      const back = data?.back;
      if (Number(back) === 21) {
        this.isBack21 = true;
      }
    });

    if (!this.isBack21) {
      this.$ps.header.next({
        progress: 80,
        heading: 'Property and guests'
      });
    }

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });



    this.saveExitSubs = this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.isSavingExit = true;
        if (this.basePrice.valid) {
          this.setPropertyPrice();
        }
        else {
          this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        }
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
          const { base_price = 1, discount_percent = 0 } = this.propertyData.property;
          this.basePrice.setValue(base_price);
          this.discountPercent.setValue(discount_percent);
        }

      });
  }

  onDiscountPercent(value): void {
    if (value && Number(value) < 0) {
      this.discountPercent.setValue(0);
    }
    if (value && Number(value) > 90) {
      this.discountPercent.setValue(90);
    }
  }



  setPropertyPrice(): void {
    this.isNextLoading = true;
    const requestData = {
      base_price: this.basePrice.value,
      discount_percent: this.discountPercent.value,
    };

    this.$propertyListingService.addSecPropertyPrice(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.base_price = respData.base_price;
      this.propertyData.property.discount_percent = respData.discount_percent;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;
      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }
      if (this.isBack21) {
        this.$router.navigate([STEP_21_ROUTE.url, this.encryptedPropertyId]);
        return;
      }
      this.$router.navigate([this.step17Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
      this.$ps.isSaveExit.next(false);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
    this.isBack21 = false;
    this.saveExitSubs.unsubscribe();
    this.isSavingExit = false;
  }


  onBasePrice(value): void {
    if (value && Number(value) < 1) {
      this.basePrice.setValue(1);
    }
  }

}
