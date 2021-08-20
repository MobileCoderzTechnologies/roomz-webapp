import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GUEST_CHECK_INS, NOTICE_GUESTS_BA } from 'src/app/constants/property-ques.constant';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_21_ROUTE, STEP_19_ROUTE, MY_LISTING_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests21',
  templateUrl: './property-guests21.component.html',
  styleUrls: ['./property-guests21.component.scss']
})
export class PropertyGuests21Component implements OnInit, AfterViewInit, OnDestroy {

  step21Route = STEP_21_ROUTE;
  step19Route = STEP_19_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  checkInQuesForm = new FormGroup({
    notice_guest_ba: new FormControl(0, Validators.required),
    guest_ci_from: new FormControl(10),
    guest_ci_to: new FormControl(22)
  });


  noticeGuestBa = NOTICE_GUESTS_BA;
  checkIns = GUEST_CHECK_INS;

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
      progress: 95,
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
        this.addPropertyQuestions();
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
          let {
            notice_guest_ba = 0,
            guest_ci_from = 10,
            guest_ci_to = 22
          } = this.propertyData.property;

          notice_guest_ba = notice_guest_ba ?? 0;
          guest_ci_to = guest_ci_to ?? 10;
          guest_ci_from = guest_ci_from ?? 22;
          this.checkInQuesForm.setValue({
            notice_guest_ba,
            guest_ci_from,
            guest_ci_to
          });
        }

      });
  }



  addPropertyQuestions(): void {
    this.isNextLoading = true;
    const requestData = this.checkInQuesForm.value;

    this.$propertyListingService.setPropertyQuestions(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.notice_guest_ba = respData.notice_guest_ba;
      this.propertyData.property.guests_ci_from = respData.guest_ci_from;
      this.propertyData.property.guests_ci_to = respData.guest_ci_to;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;

      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }

      this.$router.navigate([this.step21Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
      this.$ps.isSaveExit.next(true);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
    this.saveExitSubs.unsubscribe();
    this.isSavingExit = false;
  }



}
