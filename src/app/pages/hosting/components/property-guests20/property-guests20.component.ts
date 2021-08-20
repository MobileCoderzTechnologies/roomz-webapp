import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HAVE_GUESTS, RENTED_BEFORE } from 'src/app/constants/property-ques.constant';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_20_ROUTE, STEP_18_ROUTE, MY_LISTING_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests20',
  templateUrl: './property-guests20.component.html',
  styleUrls: ['./property-guests20.component.scss']
})
export class PropertyGuests20Component implements OnInit, AfterViewInit, OnDestroy {

  step20Route = STEP_20_ROUTE;
  step18Route = STEP_18_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  rentedBefore = RENTED_BEFORE;
  selectedRentedBefore = 1;

  haveGuests = HAVE_GUESTS;
  selectedHaveGuests = 2;

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
      progress: 91,
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
          const {
            rented_before = 1,
            have_guests = 2,
          } = this.propertyData.property;

          this.selectedRentedBefore = rented_before || 1;
          this.selectedHaveGuests = have_guests || 2;
        }

      });
  }


  onSelectHaveGuests(isChecked: boolean, value: number): void {
    if (isChecked) {
      this.selectedHaveGuests = value;
    }
    else{
      this.selectedHaveGuests = 0;
    }
  }
  onSelectRentedBefore(isChecked: boolean, value: number): void {
    if (isChecked) {
      this.selectedRentedBefore = value;
    }
    else{
      this.selectedRentedBefore = 0;
    }
  }


  addPropertyQuestions(): void {
    this.isNextLoading = true;
    const requestData = {
      rented_before: this.selectedRentedBefore,
      have_guests: this.selectedHaveGuests
    };

    this.$propertyListingService.setPropertyQuestions(this.propertyId, requestData).subscribe(res => {
      const respData = res.data[0];

      this.propertyData.property.rented_before = respData.rented_before;
      this.propertyData.property.have_guests = respData.have_guests;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;

      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }

      this.$router.navigate([this.step20Route.url, this.encryptedPropertyId]);
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
