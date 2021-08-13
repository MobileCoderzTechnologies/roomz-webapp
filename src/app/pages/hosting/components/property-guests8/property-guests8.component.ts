import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_7_ROUTE, STEP_8_ROUTE, STEP_9_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests8',
  templateUrl: './property-guests8.component.html',
  styleUrls: ['./property-guests8.component.scss']
})
export class PropertyGuests8Component implements OnInit, AfterViewInit, OnDestroy {
  step9Route = STEP_9_ROUTE;
  step7Route = STEP_7_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  coverPhotoUrl = '';
  propertyPhotos: { image_url: string }[] = [];
  showingPropertyPhotos: { image_url: string }[] = [];

  isNextLoading = false;
  isCoverPhotoUploading = false;
  isPhotosUploading = false;
  isRemovingCoverPhoto = false;

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
      progress: 45,
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
        this.addPropertyPhotos();
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
          this.coverPhotoUrl = this.propertyData.property.cover_photo || '';
          this.propertyPhotos = this.propertyData.images || [];

          this.setShowingPhotos(this.propertyPhotos);
        }
      });
  }

  selectCoverPhoto(event): void {
    const coverPhoto = event.target.files[0];
    if (coverPhoto) {
      this.isCoverPhotoUploading = true;
      const formData = new FormData();
      formData.append('images', coverPhoto);
      this.$propertyListingService.uploadPhotos(formData).subscribe(data => {
        this.isCoverPhotoUploading = false;
        this.coverPhotoUrl = data.data[0].image_url;
      }, err => {
        this.isCoverPhotoUploading = false;
        this.$alert.danger(err.message);
      });
    }
  }


  removeCoverPhoto(imageUrl: string): void {
    const requestData = {
      images: {
        image_url: imageUrl
      }
    };
    this.isRemovingCoverPhoto = true;
    this.$propertyListingService.removePhotos(requestData).subscribe(data => {
      this.isRemovingCoverPhoto = false;
      this.coverPhotoUrl = '';
    },
      err => {
        this.isRemovingCoverPhoto = false;
        this.$alert.danger(err.message);
      });
  }


  selectPropertyPhotos(event): void {
    const photos = event.target.files;
    if (photos?.length) {
      this.isPhotosUploading = true;
      this.uploadPhotos(photos);
    }
  }

  filesDropped(photos): void {
    console.log(photos);
    this.uploadPhotos(photos);
  }

  uploadPhotos(photos): void {
    this.isPhotosUploading = true;
    const formData = new FormData();
    for (const photo of photos) {
      formData.append('images', photo);
    }
    this.$propertyListingService.uploadPhotos(formData).subscribe(data => {
      this.isPhotosUploading = false;
      const pPhotos = data.data;
      this.setShowingPhotos(pPhotos);
      this.propertyPhotos.push(...pPhotos);
    }, err => {
      this.isPhotosUploading = false;
      this.$alert.danger(err.message);
    });
  }

  private setShowingPhotos(photos: { image_url: string }[]): void {
    photos.forEach(item => {
      const imageUrl = item.image_url;
      const imageUrlArr = imageUrl.split('/');
      imageUrlArr.pop();
      const imgUrl = `${imageUrlArr.join('/')}/235x158.jpeg`;
      item.image_url = imgUrl;
      this.showingPropertyPhotos.push({ ...item });
    });
  }


  removePhoto(image: { image_url: string, isDeleting: boolean }): void {
    const requestData = {
      images: [{
        image_url: image.image_url
      }]
    };
    image.isDeleting = true;
    this.$propertyListingService.removePhotos(requestData).subscribe(data => {
      image.isDeleting = false;
      this.propertyPhotos = this.propertyPhotos.filter(item => item.image_url !== image.image_url);
    },
      err => {
        image.isDeleting = false;
        this.$alert.danger(err.message);
      });
  }



  addPropertyPhotos(): void {
    this.isNextLoading = true;
    const requestData = {
      cover_photo: this.coverPhotoUrl,
      images: this.propertyPhotos
    };
    this.$propertyListingService.addPropertyPhotos(this.propertyId, requestData).subscribe(res => {
      const respData = res.data;
      this.propertyData.property.cover_photo = respData.cover_photo;
      this.propertyData.images = respData.images;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      this.isNextLoading = false;
      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }
      this.$router.navigate([this.step9Route.url, this.encryptedPropertyId]);
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
    this.saveExitSubs.unsubscribe();
  }
}
