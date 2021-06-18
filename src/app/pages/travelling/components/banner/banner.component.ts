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

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, AfterViewInit {

  selectedLanguage: string;
  isLoggedIn = false;
  currentUser: { name: string, profile: string };
  constructor(
    private $translate: LangTranslateService,
    private $dialog: MatDialog,
    private $alert: AlertService,
    private $loginService: LoginService,
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
        if (isPlatformBrowser(this.platformId)) {
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        }
      } else {
        this.isLoggedIn = false;
      }
    });
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
    })
  }

}
