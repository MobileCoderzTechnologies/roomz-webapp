import { Component, OnInit } from '@angular/core';
import { Amenity } from 'src/app/modals/amenity.modal';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_4_ROUTE, STEP_6_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests6',
  templateUrl: './property-guests6.component.html',
  styleUrls: ['./property-guests6.component.scss']
})
export class PropertyGuests6Component implements OnInit {

  step6Route = STEP_6_ROUTE;
  step4Route = STEP_4_ROUTE;

  amenities: Amenity[];
  amenitiesSpace: Amenity[];
  amenitiesNormal: Amenity[];
  amenitiesSafety: Amenity[];
  selectedAmenity: number[] = [];
  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $propertyListingService: PropertyListingService
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 23,
      heading: 'Property and guests'
    });

    this.getAmenities();
  }

  private getAmenities(): void {
    this.$propertyListingService.getAmenities().subscribe(data => {
      this.amenities = data.data;
      this.amenitiesNormal = this.amenities.filter(e => e.type === 'normal');
      this.amenitiesSafety = this.amenities.filter(e => e.type === 'safety');
      this.amenitiesSpace = this.amenities.filter(e => e.type === 'space');
    });
  }

  onCheckAmenity(id: number, isChecked: boolean): void {
    if (isChecked) {
      this.selectedAmenity.push(id);
    } else {
      this.selectedAmenity = this.selectedAmenity.filter(e => e !== id);
    }
  }

}
