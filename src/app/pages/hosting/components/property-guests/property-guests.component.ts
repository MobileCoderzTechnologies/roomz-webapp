import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyType } from 'src/app/modals/property-type.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { START_ROUTE, STEP_2_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests',
  templateUrl: './property-guests.component.html',
  styleUrls: ['./property-guests.component.scss']
})
export class PropertyGuestsComponent implements OnInit {

  startRoute = START_ROUTE;
  step2Route = STEP_2_ROUTE;

  propertyTypes: PropertyType[];

  isDedicatedGuestsSpace = true;
  isHostPrivate = false;
  selectedPropertyType: number;
  isBeachHouse = null;

  isBeachHouseShow = true;

  isNextLoading = false;

  constructor(
    private $ps: ProgressService,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService,
    private $router: Router,
    private $encryptionService: EncryptionService
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 10,
      heading: 'Property and guests'
    });
    this.getPropertyTypes();
  }

  private getPropertyTypes(): void {
    this.$propertyListingService.getPropertyTypes().subscribe(data => {
      this.propertyTypes = data.data;
      this.selectedPropertyType = this.propertyTypes[0].id;
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
      is_business_hosting: this.isHostPrivate
    };
    this.$propertyListingService.addPropertyType(dataObj)
      .subscribe(data => {
        console.log(data);
        const id = data.data.id;
        const encryptedId = this.$encryptionService.encrypt(id);
        console.log(encryptedId);
        this.isNextLoading = false;
        this.$router.navigate([this.step2Route.url, encryptedId]);
      }, err => {
        this.isNextLoading = false;
        this.$alert.danger(err.message);
      });
  }

}
