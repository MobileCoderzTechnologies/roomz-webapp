import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { $ } from 'protractor';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PropertyType } from 'src/app/modals/property-type.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, START_ROUTE, STEP_2_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests',
  templateUrl: './property-guests.component.html',
  styleUrls: ['./property-guests.component.scss']
})
export class PropertyGuestsComponent implements OnInit, AfterViewInit, OnDestroy {

  startRoute = START_ROUTE;
  step2Route = STEP_2_ROUTE;

  myListingRoute = MY_LISTING_ROUTE;

  propertyTypes: PropertyType[];

  isDedicatedGuestsSpace = true;
  isHostPrivate = false;
  selectedPropertyType: number;
  isBeachHouse = null;

  isBeachHouseShow = true;

  isNextLoading = false;

  propertyArea = new FormControl('', Validators.required);

  propertyId: number;
  encryptedPropertyId: string;
  propertyData: any;
  propertyDataSubs: Subscription;

  saveExitSubs: Subscription;

  isSavingExit = false;
  constructor(
    private $ps: ProgressService,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService,
    private $router: Router,
    private $encryptionService: EncryptionService,
    private $activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 5,
      heading: 'Property and guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      if (id) {
        this.encryptedPropertyId = id;
        this.propertyId = Number(this.$encryptionService.decrypt(id));
        console.log(this.propertyId);
      }
      else {
        this.$ps.clearPropertyData();
      }
    });
    this.getPropertyTypes();


    this.saveExitSubs = this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.isSavingExit = true;
        if (this.propertyArea.invalid) {
          this.$router.navigateByUrl(this.myListingRoute.url);
          return;
        }
        this.addPropertyTypes();
      }
    });
  }


  ngAfterViewInit(): void {
    if (this.propertyId) {
      this.setDataForUpdate();
    }
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
          const propertyArea = this.propertyData.property?.area || '';
          if (propertyArea) {
            this.propertyArea.setValue(propertyArea);
          }
          this.isDedicatedGuestsSpace = this.propertyData.property.is_dedicated_guest_space ? true : false;
          this.selectedPropertyType = this.propertyData.property.property_type || 1;
          console.log(this.selectedPropertyType);
          this.isHostPrivate = this.propertyData.property.is_business_hosting ? false : true;
          this.isBeachHouse = this.propertyData.property.is_beach_house ? true : null;

          const ar = [1, 2];
          if (!ar.includes(this.selectedPropertyType)) {
            this.isBeachHouseShow = false;
          }
        }
      });
  }
  private getPropertyTypes(): void {
    this.$propertyListingService.getPropertyTypes().subscribe(data => {
      this.propertyTypes = data.data;
      this.selectedPropertyType = this.selectedPropertyType ? this.selectedPropertyType : this.propertyTypes[0].id;
    }, err => {
      this.$alert.danger(err.message, 2000);
    });
  }

  onDedicatedGuestSpace(value: boolean): void {
    this.isDedicatedGuestsSpace = value;
  }
  onSelectPropertyType(propertyTypeId: number): void {
    this.selectedPropertyType = propertyTypeId * 1;
    if (this.selectedPropertyType === 1 || this.selectedPropertyType === 2) {
      this.isBeachHouseShow = true;
      this.isBeachHouse = false;
    }
    else {
      this.isBeachHouseShow = false;
      this.isBeachHouse = null;
    }
  }

  addPropertyTypes(): void {
    this.isNextLoading = true;
    const dataObj = {
      property_type: this.selectedPropertyType,
      is_beach_house: this.isBeachHouse,
      is_dedicated_guest_space: this.isDedicatedGuestsSpace,
      is_business_hosting: this.isHostPrivate,
      area: this.propertyArea.value
    };
    this.$propertyListingService.addPropertyType(dataObj, this.propertyId)
      .subscribe(data => {
        console.log(data);
        const respData = data.data;
        const id = data.data.id;
        const encryptedId = this.$encryptionService.encrypt(id);
        console.log(encryptedId);
        this.isNextLoading = false;
        if (this.propertyData) {
          this.propertyData.property.property_type = respData.property_type;
          this.propertyData.property.is_beach_house = respData.is_beach_house;
          this.propertyData.property.is_dedicated_guest_space = respData.is_dedicated_guest_space;
          this.propertyData.property.is_business_hosting = respData.is_business_hosting;
          this.propertyData.property.area = respData.area;

          this.$ps.clearPropertyData();
          this.$ps.setPropertyData(this.propertyData);
        }
        else {
          this.$ps.setPropertyData({ property: data.data });
        }

        if (this.isSavingExit) {
          this.$router.navigateByUrl(this.myListingRoute.url);
          return;
        }

        this.$router.navigate([this.step2Route.url, encryptedId]);

      }, err => {
        this.isNextLoading = false;
        this.$alert.danger(err.message);
      });
  }


  ngOnDestroy(): void {
    if (this.propertyDataSubs) {
      this.propertyDataSubs.unsubscribe();
    }

    if (this.saveExitSubs) {
      this.saveExitSubs.unsubscribe();
    }
  }

}
