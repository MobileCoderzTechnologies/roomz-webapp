import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-slider-third',
  templateUrl: './slider-third.component.html',
  styleUrls: ['./slider-third.component.scss']
})
export class SliderThirdComponent implements OnInit, OnChanges {

  @Input() photos: any[];
  @Input() coverPhoto: string;

  images: { image_url: string }[] = [];

  customOptions: OwlOptions = {
    loop: true,
    dots: true,
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
    // nav: true,
    // navText: ['<i class="fa-chevron-left"></i>', '<i class="fa-chevron-right"></i>']
  };
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.images = this.photos;
    // console.log(this.images);
    this.images.push({image_url: this.coverPhoto});
    const cImageUrl = this.coverPhoto;
    const cImageUrlArr = cImageUrl.split('/');
    cImageUrlArr.pop();
    const cImg = `${cImageUrlArr.join('/')}/235x158.jpeg`;
    this.images.push({ image_url: cImg });
    console.log(this.images);
  }

}
