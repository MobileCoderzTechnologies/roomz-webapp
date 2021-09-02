import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import {
  // tslint:disable-next-line: max-line-length
  MY_LISTING_ROUTE, STEP_10_ROUTE, STEP_11_ROUTE, STEP_14_ROUTE, STEP_16_ROUTE, STEP_19_ROUTE, STEP_1_ROUTE, STEP_20_ROUTE, STEP_21_ROUTE, STEP_23_ROUTE, STEP_2_ROUTE, STEP_3_ROUTE, STEP_4_ROUTE, STEP_5_ROUTE, STEP_6_ROUTE, STEP_7_ROUTE, STEP_8_ROUTE
} from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit, AfterViewInit, OnDestroy {

  step1Route = STEP_1_ROUTE;
  propertyId: number;
  encryptedPropertyId: string;
  propertyData: any;
  propertyDataSubs: Subscription;

  currentRouteIndex = 0;
  routeIndex = [
    {
      index: 0,
      route: STEP_1_ROUTE
    },
    {
      index: 1,
      route: STEP_1_ROUTE
    },
    {
      index: 2,
      route: STEP_2_ROUTE
    },
    {
      index: 3,
      route: STEP_3_ROUTE,
    },
    {
      index: 4,
      route: STEP_5_ROUTE
    },
    {
      index: 5,
      route: STEP_6_ROUTE,
    },
    {
      index: 6,
      route: STEP_7_ROUTE
    },
    {
      index: 7,
      route: STEP_8_ROUTE
    },
    {
      index: 8,
      route: STEP_10_ROUTE
    },
    {
      index: 9,
      route: STEP_11_ROUTE
    },
    {
      index: 10,
      route: STEP_14_ROUTE
    },
    {
      index: 11,
      route: STEP_16_ROUTE
    },
    {
      index: 12,
      route: STEP_23_ROUTE
    },
    {
      index: 13,
      route: STEP_19_ROUTE,
    },
    {
      index: 14,
      route: STEP_21_ROUTE
    }
  ];

  constructor(
    private $ps: ProgressService,
    private $router: Router,
    private $alert: AlertService,
    private $encryptionService: EncryptionService,
    private $activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 2,
      heading: 'Property and guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      if (id) {
        this.encryptedPropertyId = id;
        this.propertyId = Number(this.$encryptionService.decrypt(id));
        console.log(this.encryptedPropertyId);
      }
      else {
        this.$ps.clearPropertyData();
      }
    });

    this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
      }
    });
    if (this.propertyId) {
      this.setDataForUpdate();
    }

    this.$ps.isSaveExitShow.next(false);
  }

  ngAfterViewInit(): void {

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
          if (this.propertyData.property?.property_type !== null) {
            this.currentRouteIndex = 1;
          }
          if (this.propertyData.property?.no_of_bedrooms !== 0) {
            this.currentRouteIndex = 2;
          }
          if (this.propertyData.property?.zip_code !== null) {
            this.currentRouteIndex = 3;
          }
          if (this.propertyData?.amenities?.length !== 0) {
            this.currentRouteIndex = 4;
          }
          if (this.propertyData.property?.is_email_confirmed !== null) {
            this.currentRouteIndex = 5;
          }
          if (this.propertyData?.houseRules?.length !== 0) {
            this.currentRouteIndex = 6;
          }

          if (this.propertyData.property?.cover_photo !== null) {
            this.currentRouteIndex = 7;
          }
          if (this.propertyData.property?.description !== null) {
            this.currentRouteIndex = 8;
          }
          if (this.propertyData.property?.name !== null) {
            this.currentRouteIndex = 9;
          }
          if (this.propertyData.property?.min_stay !== null) {
            this.currentRouteIndex = 10;
          }
          if (this.propertyData.property?.base_price !== null) {
            this.currentRouteIndex = 11;
          }
          if (this.propertyData.property?.cancellation_policy !== null) {
            this.currentRouteIndex = 12;
          }
          if (this.propertyData.property?.rented_before !== null) {
            this.currentRouteIndex = 13;
          }
          // if (this.propertyData.property?.notice_guest_ba !== null) {
          //   this.currentRouteIndex = 13;
          // }
          if (this.propertyData.property?.weekly_discount !== null) {
            this.currentRouteIndex = 14;
          }

          console.log(this.currentRouteIndex);
        }
      });
  }


  onEditGoScreen(): void {
    const currentRouteIndex = this.routeIndex.find(e => e.index === this.currentRouteIndex);
    this.$router.navigate([currentRouteIndex.route.url, this.encryptedPropertyId], { queryParams: { isEdit: true } });
  }

  onGoEditScreenCustom(routeIndex: number): void {
    const currentRouteIndex = this.routeIndex.find(e => e.index === routeIndex);
    this.$router.navigate([currentRouteIndex.route.url, this.encryptedPropertyId], { queryParams: { isEdit: true } });
  }

  ngOnDestroy(): void {
    this.$ps.isSaveExitShow.next(true);
    if (this.propertyDataSubs) {
      this.propertyDataSubs.unsubscribe();
    }
  }
}
