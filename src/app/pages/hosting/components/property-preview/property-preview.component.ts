import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_10_ROUTE, STEP_20_ROUTE, STEP_8_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-preview',
  templateUrl: './property-preview.component.html',
  styleUrls: ['./property-preview.component.scss']
})
export class PropertyPreviewComponent implements OnInit, OnDestroy {
  step10Route = STEP_10_ROUTE;
  step8Route = STEP_8_ROUTE;

  step21Route = STEP_20_ROUTE;

  propertyId: number;
  encryptedPropertyId: string;

  propertyData: any;
  propertyDataSubs: Subscription;

  property: any;

  propertyImages: { image_url: string }[] = [];

  coverPhoto = '';

  isNextLoading = false;
  isSavingExit = false;
  saveExitSubs: Subscription;

  isBack21 = false;
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
      progress: 47,
      heading: 'Preview'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.$activatedRoute.queryParams.subscribe(data => {
      const back = data?.back;
      if (Number(back) === 21) {
        this.isBack21 = true;
      }
    });


    this.saveExitSubs = this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.isSavingExit = true;
      }
    });

    this.getPropertyData();
  }

  private getPropertyData(): void {
    this.$propertyListingService.getPropertyPreview(this.propertyId).subscribe(data => {
      this.property = data.data[0];
      console.log(this.property);


      const { images, cover_photo } = this.property;

      const cUrl = cover_photo;
      const cUrlArr = cUrl.split('/');
      cUrlArr.pop();
      const cImg = `${cUrlArr.join('/')}/1366x460.jpeg`;
      this.coverPhoto = cImg;

      images.forEach(item => {
        const imageUrl = item.image_url;
        const imageUrlArr = imageUrl.split('/');
        imageUrlArr.pop();
        const imgUrl = `${imageUrlArr.join('/')}/1366x460.jpeg`;
        item.image_url = imgUrl;
        this.propertyImages.push({ ...item });
      });

      console.log(this.propertyImages);
    },
      err => {
        this.$alert.danger(err.message);
      });
  }

  ngOnDestroy(): void {
    this.saveExitSubs.unsubscribe();
    this.isBack21 = false;
  }



}
