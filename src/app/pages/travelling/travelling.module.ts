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
import { SignUpModule } from '../sign-up/sign-up.module';
import { LoginModule } from '../login/login.module';
import { OtpComponent } from './components/otp/otp.component';
import { NgOtpInputModule } from 'ng-otp-input';



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
    OtpComponent
  ],
  imports: [
    CommonModule,
    TravellingRoutingModule,
    SharedModule,
    SignUpModule,
    LoginModule,
    NgOtpInputModule
  ],
  exports: [
    TravellingRoutingModule,
    SharedModule,
    SignUpModule,
    LoginModule,
    NgOtpInputModule
  ]
})
export class TravellingModule { }
