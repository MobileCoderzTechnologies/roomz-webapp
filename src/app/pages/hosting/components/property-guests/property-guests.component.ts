import { Component, OnInit } from '@angular/core';
import { PropertyType } from 'src/app/modals/property-type.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
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

  constructor(
    private $ps: ProgressService,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService
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

}
