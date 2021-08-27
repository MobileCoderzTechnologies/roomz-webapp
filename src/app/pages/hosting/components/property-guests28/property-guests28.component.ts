import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PROPERTY_STATUS } from 'src/app/constants/property.constant';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_21_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests28',
  templateUrl: './property-guests28.component.html',
  styleUrls: ['./property-guests28.component.scss']
})
export class PropertyGuests28Component implements OnInit, OnDestroy, AfterViewInit {

  step21Route = STEP_21_ROUTE;
  myListingRoute = MY_LISTING_ROUTE;

  isNextLoading = false;

  encryptedPropertyId: string;
  propertyId: number;

  propertyData: any;
  propertyDataSubs: Subscription;

  propertyStatus = 0;


  isSavingExit = false;
  saveExitSubs: Subscription;

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
      progress: 99,
      heading: 'Property and Guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.saveExitSubs = this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.isSavingExit = true;
        this.onPublish();
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
          const status = this.propertyData.property.status;

          if (status && status === PROPERTY_STATUS.inProgress) {
            this.propertyStatus = PROPERTY_STATUS.pendingForApproval;
          }
          if (status && status === PROPERTY_STATUS.pendingForApproval) {
            this.propertyStatus = PROPERTY_STATUS.pendingForApproval;
          }
          if (status && status === PROPERTY_STATUS.listed) {
            this.propertyStatus = PROPERTY_STATUS.listed;
          }
          if (!status) {
            this.propertyStatus = PROPERTY_STATUS.pendingForApproval;
          }

        }
      });
  }


  onPublish(): void {
    this.isNextLoading = true;

    this.$propertyListingService.publishProperty(this.propertyId, { status: this.propertyStatus }).subscribe(res => {
      this.$ps.clearPropertyData();
      this.isNextLoading = false;
      console.log(res);
      this.$alert.success(res.message);
      this.$router.navigate([this.myListingRoute.url]);
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
