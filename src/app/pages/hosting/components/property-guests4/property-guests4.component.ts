import { MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_2_ROUTE, STEP_4_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests4',
  templateUrl: './property-guests4.component.html',
  styleUrls: ['./property-guests4.component.scss']
})
export class PropertyGuests4Component implements OnInit, AfterViewInit, OnDestroy {

  step2Route = STEP_2_ROUTE;
  step4Route = STEP_4_ROUTE;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;
  propertyId: number;
  encryptedPropertyId: string;

  addressForm: FormGroup = new FormGroup({
    country: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    address_optional: new FormControl(''),
    state: new FormControl('', Validators.required),
    zip_code: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
  });

  latitude: number;
  longitude: number;
  location: string;

  isSavingExit = false;

  saveExitSubs: Subscription;

  private geoCoder;
  address: any;


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
    this.$ps.header.next({
      progress: 20,
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
        if (this.addressForm.invalid) {
          this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
          return;
        }
        this.addAddress();
      }
    });

    this.mapApiLoader();
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
            city = '',
            country = '',
            state = '',
            street = '',
            address_optional = '',
            zip_code = '',
            latitude,
            longitude,
            location,
          } = this.propertyData.property;
          this.addressForm.patchValue({
            city,
            country,
            state,
            street,
            address_optional,
            zip_code
          });

          this.latitude = latitude;
          this.longitude = longitude;
        }
      });
  }


  getCurrentLocation(): void {
    navigator.geolocation.getCurrentPosition(res => {
      this.longitude = res.coords.longitude;
      this.latitude = res.coords.latitude;
      this.getAddress(this.latitude, this.longitude);
    });
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
          console.log(this.location);
          this.address = results[0].address_components;
          const zipCode = this.address[4].long_name;
          const country = this.address[3].long_name;
          const state = this.address[2].long_name;
          const city = this.address[1].long_name;

          this.addressForm.patchValue({
            zip_code: zipCode,
            country,
            state,
            city
          });

        } else {
          this.$alert.danger('No results found');
        }
      } else {
        this.$alert.danger(`Geocoder failed due to:  ${status}`);
      }

    });
  }


  addAddress(): void {
    this.isNextLoading = true;
    const requestData = this.addressForm.value;
    requestData.latitude = this.latitude;
    requestData.longitude = this.longitude;
    requestData.location = this.location;

    this.$propertyListingService.addPropertyAddress(this.propertyId, requestData).subscribe(data => {
      this.isNextLoading = false;
      const respData = data.data[0];

      this.propertyData.property.country = respData.country;
      this.propertyData.property.city = respData.city;
      this.propertyData.property.state = respData.state;
      this.propertyData.property.street = respData.street;
      this.propertyData.property.zip_code = respData.zip_code;
      this.propertyData.property.address_optional = respData.address_optional;
      this.propertyData.property.longitude = respData.longitude;
      this.propertyData.property.latitude = respData.latitude;
      this.propertyData.property.location = respData.location;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);

      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }
      this.$router.navigate([this.step4Route.url, this.encryptedPropertyId]);
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
