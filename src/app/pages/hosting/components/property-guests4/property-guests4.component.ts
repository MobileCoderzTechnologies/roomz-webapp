import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_2_ROUTE, STEP_4_ROUTE } from '../../constants/route.constant';
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
      progress: 20,
      heading: 'Property and guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
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
            city = '',
            country = '',
            state = '',
            street = '',
            address_optional = '',
            zip_code = ''
          } = this.propertyData.property;
          this.addressForm.patchValue({
            city,
            country,
            state,
            street,
            address_optional,
            zip_code
          });
        }
      });
  }


  addAddress(): void {
    this.isNextLoading = true;
    const addressData = this.addressForm.value;
    this.$propertyListingService.addPropertyAddress(this.propertyId, addressData).subscribe(data => {
      this.isNextLoading = false;
      const respData = data.data[0];

      this.propertyData.property.country = respData.country;
      this.propertyData.property.city = respData.city;
      this.propertyData.property.state = respData.state;
      this.propertyData.property.street = respData.street;
      this.propertyData.property.zip_code = respData.zip_code;
      this.propertyData.property.address_optional = respData.address_optional;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);

      this.$router.navigate([this.step4Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
  }

}
