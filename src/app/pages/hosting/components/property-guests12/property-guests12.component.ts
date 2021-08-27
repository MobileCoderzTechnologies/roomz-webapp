import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_10_ROUTE, STEP_12_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests12',
  templateUrl: './property-guests12.component.html',
  styleUrls: ['./property-guests12.component.scss']
})
export class PropertyGuests12Component implements OnInit, AfterViewInit, OnDestroy {

  step12Route = STEP_12_ROUTE;
  step10Route = STEP_10_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;
  isOptionalExtended = false;




  nameOfListing = new FormControl(null, [Validators.required, Validators.maxLength(50), Validators.minLength(5)]);

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
      progress: 55,
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
        if (this.nameOfListing.valid) {
          this.addPropertyName();
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
          const {
            name = ''
          } = this.propertyData.property;

          this.nameOfListing.setValue(name);
        }
      });
  }


  onInputName(value: string): void {
    if (value && !value.trim()) {
      this.nameOfListing.setErrors({ required: true });
    }
  }

  addPropertyName(): void {
    this.isNextLoading = true;
    const requestData = {
      name: this.nameOfListing.value
    };



    this.$propertyListingService.addPropertyName(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.name = respData.name;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;
      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }
      this.$router.navigate([this.step12Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
      this.$ps.isSaveExit.next(false);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
    this.saveExitSubs.unsubscribe();
    this.isSavingExit = false;
  }



}
