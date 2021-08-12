import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { request } from 'express';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_11_ROUTE, STEP_9_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests10',
  templateUrl: './property-guests10.component.html',
  styleUrls: ['./property-guests10.component.scss']
})
export class PropertyGuests10Component implements OnInit, AfterViewInit, OnDestroy {

  step11Route = STEP_11_ROUTE;
  step9Route = STEP_9_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;
  isOptionalExtended = false;

  descForm = new FormGroup({
    description: new FormControl(null, [Validators.required, Validators.minLength(20), Validators.maxLength(500)]),
  });


  desc_getting_around = new FormControl(null, [Validators.minLength(20), Validators.maxLength(500)]);
  desc_your_space = new FormControl(null, [Validators.minLength(20), Validators.maxLength(500)]);
  desc_interaction_guests = new FormControl(null, [Validators.minLength(20), Validators.maxLength(500)]);
  desc_neighbourhood = new FormControl(null, [Validators.minLength(20), Validators.maxLength(500)]);


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
      progress: 51,
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
            description = '',
            desc_getting_around = '',
            desc_your_space = '',
            desc_interaction_guests = '',
            desc_neighbourhood = ''
          } = this.propertyData.property;

          this.descForm.setValue({
            description,
          });

          this.desc_getting_around.setValue(desc_getting_around);
          this.desc_your_space.setValue(desc_your_space);
          this.desc_interaction_guests.setValue(desc_interaction_guests);
          this.desc_neighbourhood.setValue(desc_neighbourhood);
        }
      });
  }


  addPropertyDesc(): void {
    this.isNextLoading = true;
    const requestData = this.descForm.value;
    
    requestData.desc_getting_around = this.desc_getting_around.value;
    requestData.desc_your_space = this.desc_your_space.value;
    requestData.desc_interaction_guests = this.desc_interaction_guests.value;
    requestData.desc_neighbourhood = this.desc_neighbourhood.value;
    
    this.$propertyListingService.addPropertyDescription(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.description = respData.description;
      this.propertyData.property.desc_your_space = respData.desc_your_space;
      this.propertyData.property.desc_interaction_guests = respData.desc_interaction_guests;
      this.propertyData.property.desc_neighbourhood = respData.desc_neighbourhood;
      this.propertyData.property.desc_getting_around = respData.desc_getting_around;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;

      this.$router.navigate([this.step11Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
  }
}
