import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { LoginService } from 'src/app/pages/login/services/login.service';
import { LangTranslateService } from 'src/app/services/lang-translate.service';
import { WelcomeComponent } from '../welcome/welcome.component';
import Swal from 'sweetalert2'
import { isPlatformBrowser } from '@angular/common';
import { ListingStatusService } from '../../services/listing-status.service';
import { Router } from '@angular/router';
import { HOSTING_ROUTE } from 'src/app/constants/route.constants';
import { LISTING_HOME_ROUTE } from 'src/app/pages/hosting/constants/route.constant';
import { FormControl, Validators } from '@angular/forms';
import { SEARCH_PAGE_ROUTE } from '../../constants/route.constant';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, AfterViewInit {

  selectedLanguage: string;
  isLoggedIn = false;
  currentUser: { name: string, profile: string };

  ListingStatus = false;

  search = new FormControl('', Validators.required);

  constructor(
    private $translate: LangTranslateService,
    private $dialog: MatDialog,
    private $alert: AlertService,
    private $loginService: LoginService,
    private $listingStatus: ListingStatusService,
    private $router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!localStorage.getItem('isWelcome')) {
        localStorage.setItem('isWelcome', '1');
        this.onWelcome();
      }
    }
    if (this.$translate.selectedLanguage === 'en') {
      this.selectedLanguage = 'ENGLISH';
    }
    if (this.$translate.selectedLanguage === 'ar') {
      this.selectedLanguage = 'العربية';
    }
  }

  ngAfterViewInit(): void {
    this.$loginService.isLoggedIn.pipe(
      delay(0)
    ).subscribe(loginStatus => {
      if (loginStatus) {
        this.isLoggedIn = true;
        this.userListingStatus();
        if (isPlatformBrowser(this.platformId)) {
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        }
      } else {
        this.isLoggedIn = false;
        this.ListingStatus = false;
      }
    });
  }

  private userListingStatus(): void {
    this.$listingStatus.getListingStatus().subscribe(data => {
      this.ListingStatus = data?.data?.listing_status;
    });
  }

  onSwitching(): void {
    if (this.isLoggedIn) {
      if (this.ListingStatus) {
        this.$router.navigateByUrl(HOSTING_ROUTE.url);
      }
      else {
        this.$router.navigateByUrl(LISTING_HOME_ROUTE.url);
      }
    }
    else {
      this.onLogin();
    }
  }


  onLogin(data: any = null): void {
    const dialogRef = this.$dialog.open(LoginComponent, {
      height: 'fit-content',
      maxHeight: '90vh',
      width: 'fit-content',
      autoFocus: false,
      data
    });
    dialogRef.afterClosed().subscribe(success => {
      if (success) {

      }
    });
  }

  onWelcome(): void {
    const dialogRef = this.$dialog.open(WelcomeComponent, {
      height: 'fit-content',
      maxHeight: '90vh',
      width: 'fit-content',
    });
    dialogRef.afterClosed().subscribe(success => {
      if (success) {
        this.onLogin();
      }
    });
  }

  // private onEnterOtp(data): void {
  //   const dialogRef = this.$dialog.open(OtpComponent, {
  //     height: 'fit-content',
  //     maxHeight: '90vh',
  //     width: 'fit-content',
  //     autoFocus: false,
  //     data
  //   });
  //   dialogRef.afterClosed().subscribe(success => {
  //     if (success) {
  //       if (success.isVerified) {
  //         this.onSignUp({
  //           createAccount: true,
  //           phone_number: data.phone_number,
  //           country_code: data.country_code
  //         });
  //       }
  //     }
  //   });
  // }


  onLogout(): void {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.$loginService.logout();
      }
    });
  }



  onSearch(): void {
    const search = this.search.value;

    this.$router.navigate([SEARCH_PAGE_ROUTE.url], { queryParams: { s: search } });
  }


}
