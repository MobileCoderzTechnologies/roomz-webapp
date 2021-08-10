import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as e from 'express';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HomeDetail } from 'src/app/modals/home-detail.modal';
import { HouseRule } from 'src/app/modals/house-rule.modal';
import { PropertyHomeDetail } from 'src/app/modals/property-home-detail.modal';
import { PropertyHouseRule } from 'src/app/modals/property-house-rule.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_6_ROUTE, STEP_8_ROUTE } from '../../constants/route.constant';
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
          this.selectedPropertyDetails = this.propertyData.homeDetails || [];
          if (this.propertyData?.houseRules) {
            this.propertyHouseRules = this.propertyData.houseRules;
          }
        }
      });
  }

  private getHouseRule(): void {
    this.$propertyListingService.getHomeRules().subscribe(data => {
      this.houseRules = data.data;

      this.houseRules.forEach(element => {
        this.houseRuleObj[element.id] = element.rule;
        if (this.propertyHouseRules.length === 0) {
          this.propertyHouseRules.push({
            rule_id: element.id,
            is_cancelled: false,
            is_additional: false,
            cancel_reason: null,
            description: null
          });
        }
      });
    }, err => {
      this.$alert.danger(err.message);
    });
  }

  private getHomeDetails(): void {
    this.$propertyListingService.getHomeDetails().subscribe(data => {
      this.homeDetails = data.data;

      this.homeDetails = this.homeDetails.map(item => {
        if (this.selectedPropertyDetails.some(element => element.detail_id === item.id)) {
          item.isChecked = true;
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

  selectDetail(detail: HomeDetail): void {
    detail.isChecked = true;
    const selectedDetail: PropertyHomeDetail = {
      detail_id: detail.id,
    };

    this.selectedPropertyDetails.push(selectedDetail);
  }

  saveAdditionalRule(ruleDesc: string): void {
    const ruleData = {
      is_additional: true,
      description: ruleDesc
    };

    this.propertyHouseRules.push(ruleData);
  }





  addHouseRule(): void {
    this.isNextLoading = true;
    const reqDetailData = {
      property_details: this.selectedPropertyDetails
    };
    this.$propertyListingService.addPropertyDetails(this.propertyId, reqDetailData).subscribe(data => {
      const details = data.data;
      const selectedRuleData = {
        property_rules: this.propertyHouseRules
      };
      this.$propertyListingService.addHouseRules(this.propertyId, selectedRuleData).subscribe(res => {
        const houseRules = res.data;

        this.propertyData.houseRules = houseRules;
        this.propertyData.details = details;

        this.$ps.clearPropertyData();
        this.$ps.setPropertyData(this.propertyData);
        this.isNextLoading = false;

        this.$router.navigate([this.step8Route.url, this.encryptedPropertyId]);
      }, err => {
        this.isNextLoading = false;
        this.$alert.danger(err.message);
      });
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }

  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
  }

}
