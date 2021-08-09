import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Amenity } from 'src/app/modals/amenity.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_4_ROUTE, STEP_6_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests6',
  templateUrl: './property-guests6.component.html',
  styleUrls: ['./property-guests6.component.scss']
})
export class PropertyGuests6Component implements OnInit, AfterViewInit, OnDestroy {

  step6Route = STEP_6_ROUTE;
  step4Route = STEP_4_ROUTE;

  amenities: Amenity[];
  amenitiesSpace: Amenity[];
  amenitiesNormal: Amenity[];
  amenitiesSafety: Amenity[];

  selectedAmenity: number[] = [];
  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;


  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $router: Router,
    private $activatedRoute: ActivatedRoute,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 30,
      heading: 'Property and guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });
    this.getAmenities();
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
        if (this.propertyData?.amenities) {
          this.selectedAmenity = this.propertyData.amenities || [];
        }
      });
  }


  showCheckedAmenity(amenityId: number): boolean {
    if (this.selectedAmenity.includes(amenityId)) {
      return true;
    }
    return false;
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


  addAmenities(): void {
    this.isNextLoading = true;
    const requestData = {
      amenities: this.selectedAmenity
    };
    this.$propertyListingService.addPropertyAmenities(this.propertyId, requestData).subscribe(data => {
      this.isNextLoading = false;
      const respData = data.data;
      this.propertyData.amenities = respData.map(e => e = e.amenity_id);

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);

      this.$router.navigate([this.step6Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });

  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
  }

}
