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
  selector: 'app-cancellation-policy',
  templateUrl: './cancellation-policy.component.html',
  styleUrls: ['./cancellation-policy.component.scss']
})
export class CancellationPolicyComponent implements OnInit, AfterViewInit, OnDestroy {
  step16Route = STEP_16_ROUTE;
  step18Route = STEP_18_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  cancellation_policy: 'flexible' | 'moderate' | 'strict' = 'flexible';

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
      heading: 'Cancellation Policy'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.saveExitSubs = this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.isSavingExit = true;
        this.onNext();
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
          const { cancellation_policy = 'flexible' } = this.propertyData.property;
          this.cancellation_policy = cancellation_policy || 'flexible';
        }

      });
  }

  onCheck(isChecked: boolean, policy: 'flexible' | 'moderate' | 'strict'): void {
    console.log(isChecked);
    if (isChecked) {
      this.cancellation_policy = policy;
    }
    else {
      this.cancellation_policy = null;
    }
  }

  onNext(): void {
    this.isNextLoading = true;
    const requestData = {
      cancellation_policy: this.cancellation_policy,
    };

    this.$propertyListingService.lawsAndCalenderMark(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.cancellation_policy = respData.cancellation_policy;
      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;

      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }

      this.$router.navigate([this.step18Route.url, this.encryptedPropertyId]);
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
