import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_10_ROUTE, STEP_20_ROUTE, STEP_8_ROUTE } from '../../constants/route.constant';
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

  isShowAmenities = false;

  isNextLoading = false;
  isSavingExit = false;
  saveExitSubs: Subscription;

  isBack21 = false;

  bedGroup: {
    [key: string]: any[]
  } = {};

  noOfBedsArr = [];

  currentSlide = 1;
  customOptions: OwlOptions = {
    loop: true,
    dots: false,
    navSpeed: 600,
    autoplay: true,
    autoplayTimeout: 2000,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      760: {
        items: 1
      },
      1000: {
        items: 1
      }
    },
  };

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
        this.onNext();
      }
    });

    this.getPropertyData();
  }

  private getPropertyData(): void {
    this.$propertyListingService.getPropertyPreview(this.propertyId).subscribe(data => {
      this.property = data.data[0];
      console.log(this.property);


      const { images, cover_photo, beds } = this.property;
      this.groupBeds(beds);
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


  private groupBeds(beds: any[]): void {
    beds.forEach(item => {
      if (this.bedGroup[item.serial_number]) {
        this.bedGroup[item.serial_number].push({ ...item });
      }
      else {
        this.bedGroup[item.serial_number] = [{ ...item }];
        this.noOfBedsArr.push(item.serial_number);
      }
    });
  }

  onNext(): void {

    if (this.isSavingExit) {
      this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
      return;
    }
    this.$router.navigate([this.step10Route.url, this.encryptedPropertyId])
  }

  ngOnDestroy(): void {
    this.saveExitSubs.unsubscribe();
    this.isBack21 = false;
  }


  onSlideChange(event): void {
    this.currentSlide = event.startPosition + 1;
  }



}
