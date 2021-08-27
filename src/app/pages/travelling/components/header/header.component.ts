import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { HOSTING_ROUTE } from 'src/app/constants/route.constants';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LISTING_HOME_ROUTE } from 'src/app/pages/hosting/constants/route.constant';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { LoginService } from 'src/app/pages/login/services/login.service';
import { LangTranslateService } from 'src/app/services/lang-translate.service';
import Swal from 'sweetalert2';
import { ListingStatusService } from '../../services/listing-status.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  selectedLanguage = 'en';
  isLoggedIn = false;
  currentUser: { name: string, profile: string };

  ListingStatus = false;

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
}
