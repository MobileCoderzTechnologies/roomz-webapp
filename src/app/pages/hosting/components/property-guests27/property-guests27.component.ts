import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_20_ROUTE, STEP_22_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests27',
  templateUrl: './property-guests27.component.html',
  styleUrls: ['./property-guests27.component.scss']
})
export class PropertyGuests27Component implements OnInit, AfterViewInit, OnDestroy {

  step22Route = STEP_22_ROUTE;
  step20Route = STEP_20_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;

  property: any;

  coverImage = '';
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
      progress: 98,
      heading: 'Calendar and availability'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.getPropertyDetails();

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
            weekly_discount = 0,
            monthly_discount = 0,
          } = this.propertyData.property;


        }

      });
  }


  private getPropertyDetails(): void {
    this.$propertyListingService.getPropertyPreview(this.propertyId).subscribe(data => {
      this.property = data.data[0];
      console.log(this.property);
      const coverPhoto = this.property.cover_photo.split('/');
      coverPhoto.pop();

      this.coverImage = `${coverPhoto.join('/')}/576x250.jpeg`;
      console.log(this.coverImage);

    },
      err => {
        this.$alert.danger(err.message);
      });
  }



  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
  }

}
