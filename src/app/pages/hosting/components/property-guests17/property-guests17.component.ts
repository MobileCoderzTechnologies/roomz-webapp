import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as e from 'express';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { delay, ignoreElements } from 'rxjs/operators';
import { HomeDetail } from 'src/app/modals/home-detail.modal';
import { HouseRule } from 'src/app/modals/house-rule.modal';
import { PropertyHomeDetail } from 'src/app/modals/property-home-detail.modal';
import { PropertyHouseRule } from 'src/app/modals/property-house-rule.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_21_ROUTE, STEP_6_ROUTE, STEP_8_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';
import { RuleReasonModelComponent } from '../rule-reason-model/rule-reason-model.component';

@Component({
  selector: 'app-property-guests17',
  templateUrl: './property-guests17.component.html',
  styleUrls: ['./property-guests17.component.scss']
})
export class PropertyGuests17Component implements OnInit, AfterViewInit, OnDestroy {

  step8Route = STEP_8_ROUTE;
  step6Route = STEP_6_ROUTE;

  step21Route = STEP_21_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  houseRules: HouseRule[] = [];
  houseRuleObj: { [key: string]: string } = {};
  homeDetails: HomeDetail[] = [];

  propertyHouseRules: PropertyHouseRule[] = [];
  selectedPropertyDetails: PropertyHomeDetail[] = [];

  additionalRuleInput = new FormControl(null, [Validators.minLength(5)]);

  isBack21 = false;

  isSavingExit = false;
  saveExitSubs: Subscription;

  isDetailError = false;

  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $router: Router,
    private $activatedRoute: ActivatedRoute,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService,
    private $dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 40,
      heading: 'Property and guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.$activatedRoute.queryParams.subscribe(data => {
      const back = data.back;

      if (Number(back) === 21) {
        this.isBack21 = true;
      }
    });

    this.saveExitSubs = this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.isSavingExit = true;
        this.addHouseRule();
      }
    });

    this.getHouseRule();
    this.getHomeDetails();
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
          this.selectedPropertyDetails = this.propertyData.details || [];
          if (this.propertyData?.houseRules) {
            this.propertyHouseRules = this.propertyData.houseRules;
          }
        }
      });
  }

  private getHouseRule(): void {
    this.$propertyListingService.getHomeRules().subscribe(data => {
      this.houseRules = data.data;

      if (this.propertyHouseRules.length === 0) {
        this.houseRules.forEach(element => {
          this.houseRuleObj[element.id] = element.rule;
          this.propertyHouseRules.push({
            rule_id: element.id,
            is_cancelled: false,
            cancel_reason: null,
          });
        });
      }
      else {
        this.houseRules.forEach(element => {
          this.houseRuleObj[element.id] = element.rule;
        });
      }
    }, err => {
      this.$alert.danger(err.message);
    });
  }

  private getHomeDetails(): void {
    this.$propertyListingService.getHomeDetails().subscribe(data => {
      this.homeDetails = data.data;

      this.homeDetails = this.homeDetails.map(item => {
        const isExist = this.selectedPropertyDetails.find(element => element.detail_id === item.id);
        if (isExist) {
          item.isChecked = true;
          item.explanation = isExist.explanation;
        } else {
          item.isChecked = false;
          item.explanation = '';
        }
        return item;
      });
      console.log(this.homeDetails);
    }, err => {
      this.$alert.danger(err.message);
    });
  }

  cancelRule(rule: PropertyHouseRule): void {
    const dialogRef = this.$dialog.open(RuleReasonModelComponent, {
      height: 'auto',
      width: 'auto',
      maxHeight: '90vh',
      data: { rule },
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.propertyHouseRules = this.propertyHouseRules.map(e => {
          if (e.rule_id === data.rule_id) {
            e = data;
          }
          return e;
        });
      }
    });

  }


  activeRule(rule: PropertyHouseRule): void {
    rule.cancel_reason = null;
    rule.is_cancelled = false;
  }

  selectDetail(event: any, detail: HomeDetail): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      detail.isChecked = true;
      const selectedDetail: PropertyHomeDetail = {
        detail_id: detail.id,
      };
      this.selectedPropertyDetails.push(selectedDetail);
    } else {
      detail.isChecked = false;
      this.selectedPropertyDetails = this.selectedPropertyDetails.filter(e => e.detail_id !== detail.id);
    }
  }

  onTouchDetail(detail: HomeDetail): void {
    detail.isTouched = true;
  }

  addDetailDesc(detail: HomeDetail, description: string): void {
    this.isDetailError = false;
    if (!description) {
      detail.isError = true;
      this.isDetailError = true;
      return;
    }
    this.selectedPropertyDetails = this.selectedPropertyDetails.map(item => {
      if (item.detail_id === detail.id) {
        item.explanation = description;
        detail.isError = false;
        this.isDetailError = false;
      }
      return item;
    });
  }

  saveAdditionalRule(): void {
    const ruleDesc = this.additionalRuleInput.value;
    const ruleData = {
      is_additional: true,
      description: ruleDesc
    };
    this.additionalRuleInput.reset();
    this.propertyHouseRules.push(ruleData);
  }


  removeAdditionalRule(index: number): void {
    console.log(index);
    this.propertyHouseRules.splice(index, 1);
  }





  addHouseRule(): void {
    this.isNextLoading = true;
    const requestData = {
      property_details: this.selectedPropertyDetails,
      property_rules: this.propertyHouseRules
    };
    this.$propertyListingService.addHouseRules(this.propertyId, requestData).subscribe(res => {
      const respData = res.data;
      this.propertyData.houseRules = respData.rules;
      this.propertyData.details = respData.details;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;

      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }

      this.$router.navigate([this.step8Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
      if (this.isSavingExit) {
        this.$ps.isSaveExit.next(false);
      }
    });

  }

  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
    this.isBack21 = false;
    this.saveExitSubs.unsubscribe();
  }

}
