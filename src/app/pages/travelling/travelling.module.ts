import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TravellingRoutingModule } from './travelling-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { BannerComponent } from './components/banner/banner.component';
import { ExploreComponent } from './components/explore/explore.component';
import { MostPopularComponent } from './components/most-popular/most-popular.component';
import { RentOutComponent } from './components/rent-out/rent-out.component';
import { ValuesComponent } from './components/values/values.component';
import { StudentAccommodationComponent } from './components/student-accommodation/student-accommodation.component';
import { PartnersComponent } from './components/partners/partners.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginModule } from '../login/login.module';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';
import { HeaderComponent } from './components/header/header.component';
import { GoogleMapModule } from 'src/app/modules/google-map/google-map.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SliderThirdComponent } from './components/slider-third/slider-third.component';


@NgModule({
  declarations: [
    HomeComponent,
    BannerComponent,
    ExploreComponent,
    MostPopularComponent,
    RentOutComponent,
    ValuesComponent,
    StudentAccommodationComponent,
    PartnersComponent,
    FooterComponent,
    WelcomeComponent,
    SearchPageComponent,
    PropertyDetailComponent,
    HeaderComponent,
    SliderThirdComponent,
  ],
  imports: [
    CommonModule,
    TravellingRoutingModule,
    SharedModule,
    LoginModule,
    GoogleMapModule,
    NgxPaginationModule,
    CarouselModule

  ],
  exports: [
    TravellingRoutingModule,
    SharedModule,
    LoginModule,
    GoogleMapModule,
    NgxPaginationModule,
    CarouselModule
  ]
})
export class TravellingModule { }
