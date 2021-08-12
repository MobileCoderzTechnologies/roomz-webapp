import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_10_ROUTE, STEP_12_ROUTE } from '../../constants/route.constant';
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




  nameOfListing = new FormControl(null, [Validators.required]);


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

      this.$router.navigate([this.step12Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
  }



}
