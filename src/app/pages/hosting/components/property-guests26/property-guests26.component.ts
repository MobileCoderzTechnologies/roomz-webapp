import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_16_ROUTE, STEP_18_ROUTE, STEP_23_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests26',
  templateUrl: './property-guests26.component.html',
  styleUrls: ['./property-guests26.component.scss']
})
export class PropertyGuests26Component implements OnInit, AfterViewInit, OnDestroy {

  step18Route = STEP_18_ROUTE;
  step16Route = STEP_16_ROUTE;
  step23Route = STEP_23_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  isLocalLaws = true;

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
      progress: 83,
      heading: 'Calendar and availability'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.saveExitSubs = this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.isSavingExit = true;
        this.propertyLocalLaws();
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
          const { is_local_laws = true } = this.propertyData.property;
          this.isLocalLaws = is_local_laws ? true : false;
        }

      });
  }

  onMarkLocalLaws(status: boolean): void {
    this.isLocalLaws = status;
  }
  propertyLocalLaws(): void {
    this.isNextLoading = true;
    const requestData = {
      is_local_laws: this.isLocalLaws,
    };

    this.$propertyListingService.lawsAndCalenderMark(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.is_local_laws = respData.is_local_laws;
      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;

      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }

      this.$router.navigate([this.step23Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
      this.$ps.isSaveExit.next(false);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
    this.saveExitSubs.unsubscribe();
  }

}
