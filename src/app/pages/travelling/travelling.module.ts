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
  ],
  imports: [
    CommonModule,
    TravellingRoutingModule,
    SharedModule,
    LoginModule,
  ],
  exports: [
    TravellingRoutingModule,
    SharedModule,
    LoginModule,
  ]
})
export class TravellingModule { }
