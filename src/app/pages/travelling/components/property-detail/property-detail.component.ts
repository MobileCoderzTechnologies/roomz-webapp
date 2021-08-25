import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SEARCH_PAGE_ROUTE } from '../../constants/route.constant';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {

  searchPageRoute = SEARCH_PAGE_ROUTE;
  propertyId: number;
  isLoading = false;
  propertyImages: { image_url: string }[] = [];
  property: any;
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

  expandedHouseRules = false;
  expendedDesc = false;
  expandedAmenities = false;

  currentDate: Date;
  nextDate: Date;

  deletedPrice: number;

  bedGroup: {
    [key: string]: any[]
  } = {};

  noOfBedsArr = [];

  constructor(
    private $encryptionService: EncryptionService,
    private $propertyService: PropertyService,
    private $activateRoute: ActivatedRoute,
    private $alert: AlertService
  ) { }

  ngOnInit(): void {

    this.$activateRoute.params.subscribe(params => {
      const id = params.id;
      const decryptedId = this.$encryptionService.decrypt(id);
      this.propertyId = Number(decryptedId);
    });

    this.getPropertyDetails();
    this.setDates();
  }


  private setDates(): void {
    this.currentDate = new Date();
    const time = this.currentDate.getTime();
    const next3Day = time + (3 * 24 * 60 * 60 * 1000);
    this.nextDate = new Date(next3Day);

  }

  goBack(): void {
    window.history.back();
  }


  private getPropertyDetails(): void {
    this.isLoading = true;
    this.$propertyService.getPropertyDetails(this.propertyId).subscribe(data => {
      this.isLoading = false;
      this.property = data.data[0];
      const { images, beds, cover_photo } = this.property;
      this.groupBeds(this.property?.beds);
      console.log(this.property);
      this.deletedPrice = this.deletedPriceCal(this.property?.base_price);
      const cImageUrl = cover_photo;
      const cImageUrlArr = cImageUrl.split('/');
      cImageUrlArr.pop();
      const cImg = `${cImageUrlArr.join('/')}/1366x460.jpeg`;
      this.propertyImages.push({ image_url: cImg });

      images.forEach(item => {
        const imageUrl = item.image_url;
        const imageUrlArr = imageUrl.split('/');
        imageUrlArr.pop();
        const imgUrl = `${imageUrlArr.join('/')}/1366x460.jpeg`;
        item.image_url = imgUrl;
        this.propertyImages.push({ ...item });

        console.log(this.propertyImages);
      });
    },
      err => {
        this.isLoading = false;
        this.$alert.danger(err.message);
      });
  }


  deletedPriceCal(price): number {
    const p = Math.floor(price * 0.2);
    return price + p;
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


  onSlideChange(event): void {
    this.currentSlide = event.startPosition + 1;
  }
}
