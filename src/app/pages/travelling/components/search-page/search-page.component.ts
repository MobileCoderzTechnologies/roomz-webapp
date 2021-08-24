import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PROPERTY_DETAIL_ROUTE } from '../../constants/route.constant';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  properties: any[] = [];
  searchTxt = '';
  isLoading = false;
  page = 1;
  pageSize = 10;

  totalCount = 0;

  latitude = 23.8859;
  longitude = 45.0792;


  markers: any[] = [];

  currentDate: Date;
  nextDate: Date;

  propertyImages: { image_url: string }[] = [];

  constructor(
    private $activatedRoute: ActivatedRoute,
    private $propertyService: PropertyService,
    private $router: Router,
    private $encryptionService: EncryptionService
  ) {

  }

  ngOnInit(): void {
    this.$activatedRoute.queryParams.subscribe(data => {
      this.searchTxt = data.s;
    });

    this.getProperties();
    this.getLocation();
    this.setDates();
  }


  private getLocation(): void {
    navigator.geolocation.getCurrentPosition(res => {
      this.latitude = res.coords.latitude;
      this.longitude = res.coords.longitude;
    });
  }


  private setDates(): void {
    this.currentDate = new Date();
    const time = this.currentDate.getTime();
    const next3Day = time + (3 * 24 * 60 * 60 * 1000);
    this.nextDate = new Date(next3Day);

  }


  private getProperties(): void {
    this.isLoading = true;
    this.$propertyService.getSearchedProperties(
      this.page,
      this.pageSize,
      this.searchTxt
    )
      .subscribe(data => {
        this.isLoading = false;
        this.properties = data?.properties?.data;
        this.totalCount = data?.meta?.total;
        console.log(this.properties);

        this.properties.forEach(item => {
          const marker = {
            lat: item.latitude,
            lng: item.longitude,
            mark: `$ ${item.base_price}`
          };
          this.markers.push(marker);

          item.images = this.setShowingPhotos(item.images);
        });

        // console.log(this.markers);
      }, err => {
        this.isLoading = false;
      });
  }


  private setShowingPhotos(photos: any[]): { image_url: string }[] {
    console.log(photos);
    const propertyImages = [];
    photos.forEach((element) => {
      const item = { ...element };
      const imageUrl = item.image_url;
      const imageUrlArr = imageUrl.split('/');
      imageUrlArr.pop();
      const imgUrl = `${imageUrlArr.join('/')}/235x158.jpeg`;
      item.image_url = imgUrl;
      propertyImages.push({ ...item });
    });
    return propertyImages;
  }

  onPageChange(event): void {
    this.page = event;
    this.getProperties();
  }

  onPropertyDetail(id: number): void {
    const encrypted = this.$encryptionService.encrypt(id);
    this.$router.navigate([PROPERTY_DETAIL_ROUTE.url, encrypted]);
  }
}
