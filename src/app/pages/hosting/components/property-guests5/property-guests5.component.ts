import { MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_3_ROUTE, STEP_5_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests5',
  templateUrl: './property-guests5.component.html',
  styleUrls: ['./property-guests5.component.scss']
})
export class PropertyGuests5Component implements OnInit, AfterViewInit, OnDestroy {

  step5Route = STEP_5_ROUTE;
  step3Route = STEP_3_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  latitude: number;
  longitude: number;
  location: string;

  zoom = 17;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  private geoCoder: any;

  isSavingExit = false;

  saveExitSubs: Subscription;

  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $router: Router,
    private $activatedRoute: ActivatedRoute,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService,
    private $mapsApiLoader: MapsAPILoader,
    private $ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.mapApiLoader();
    this.$ps.header.next({
      progress: 25,
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
        this.addPropertyLocation();
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
            location = '',
            latitude = 0,
            longitude = 0,
          } = this.propertyData.property;
          this.latitude = latitude;
          this.location = location;
          this.longitude = longitude;
        }
      });
  }

  markerDragEnd(event): void {
    console.log(event);
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    console.log(this.latitude, this.longitude);
    this.getAddress(this.latitude, this.longitude);
  }


  private mapApiLoader(): void {
    this.$mapsApiLoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    });

  }


  private getAddress(latitude, longitude): void {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.location = results[0].formatted_address;
        } else {
          this.$alert.danger('No results found');
        }
      } else {
        this.$alert.danger(`Geocoder failed due to:  ${status}`);
      }

    });
  }



  addPropertyLocation(): void {
    this.isNextLoading = true;
    const locationData = {
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude,
    };
    this.$propertyListingService.addPropertyLocation(this.propertyId, locationData).subscribe(data => {
      this.isNextLoading = false;
      const respData = data.data[0];
      this.propertyData.property.location = respData.location;
      this.propertyData.property.latitude = respData.latitude;
      this.propertyData.property.longitude = respData.longitude;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);

      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }
      this.$router.navigate([this.step5Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }

  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
    this.saveExitSubs.unsubscribe();
  }

}
