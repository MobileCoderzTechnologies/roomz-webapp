import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_13_ROUTE, STEP_11_ROUTE, MY_LISTING_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests13',
  templateUrl: './property-guests13.component.html',
  styleUrls: ['./property-guests13.component.scss']
})
export class PropertyGuests13Component implements OnInit, AfterViewInit, OnDestroy {

  step13Route = STEP_13_ROUTE;
  step11Route = STEP_11_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  isNextLoading = false;
  isOptionalExtended = false;

  profilePhotoUrl = '';

  selectedProfilePhoto: any;
  selectedImage: any;

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
      progress: 60,
      heading: 'Property and guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.saveExitSubs = this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.isSavingExit = true;
        if (this.selectedImage) {
          this.updateProfilePhoto();
        }
        else {
          this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        }
      }
    });

    this.getUserProfile();
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

        }
      });
  }


  private getUserProfile(): void {
    this.$propertyListingService.getUser().subscribe(data => {
      const respData = data.data[0];
      this.profilePhotoUrl = respData?.avatar || '';
    }, err => {
      this.$alert.danger(err.message);
    });
  }

  selectProfilePhoto(event): void {
    const photo = event.target.files[0];

    if (photo) {
      this.selectedImage = photo;
      this.profilePhotoUrl = '';
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProfilePhoto = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  updateProfilePhoto(): void {
    this.isNextLoading = true;
    if (this.selectedImage) {
      const formData = new FormData();
      formData.set('photo', this.selectedImage);
      this.$propertyListingService.userProfilePhoto(formData).subscribe(res => {
        this.isNextLoading = false;

        if (this.isSavingExit) {
          this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
          return;
        }
        this.$router.navigate([this.step13Route.url, this.encryptedPropertyId]);
      }, err => {
        this.isNextLoading = false;
        this.$alert.danger(err.message);
      });
    }
    else {
      this.$router.navigate([this.step13Route.url, this.encryptedPropertyId]);
      this.$ps.isSaveExit.next(false);
    }
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
    this.saveExitSubs.unsubscribe();
  }


}
