import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_19_ROUTE, STEP_17_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests19',
  templateUrl: './property-guests19.component.html',
  styleUrls: ['./property-guests19.component.scss']
})
export class PropertyGuests19Component implements OnInit, AfterViewInit, OnDestroy {

  step19Route = STEP_19_ROUTE;
  step17Route = STEP_17_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  isUpdatedCalender = true;
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
      progress: 87,
      heading: 'Calendar and availability'
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
          const { is_updated_calender = true } = this.propertyData.property;
          this.isUpdatedCalender = is_updated_calender ? true : false;
        }

      });
  }

  onMarkUpdatedCalender(status: boolean): void {
    this.isUpdatedCalender = status;
  }

  propertyUpdatedCalender(): void {
    this.isNextLoading = true;
    const requestData = {
      is_updated_calender: this.isUpdatedCalender,
    };

    this.$propertyListingService.lawsAndCalenderMark(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.is_local_laws = respData.is_local_laws;
      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;

      this.$router.navigate([this.step19Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
  }


}
