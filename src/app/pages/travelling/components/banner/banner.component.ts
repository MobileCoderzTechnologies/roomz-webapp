import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { delay } from 'rxjs/operators';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { LoginService } from 'src/app/pages/login/services/login.service';
import { SignUpComponent } from 'src/app/pages/sign-up/sign-up.component';
import { LangTranslateService } from 'src/app/services/lang-translate.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, AfterViewInit {

  selectedLanguage: string;
  isLoggedIn = false;
  constructor(
    private $translate: LangTranslateService,
    private $dialog: MatDialog,
    private $alert: AlertService,
    private $loginService: LoginService
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
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  onSignUp(data: any = null): void {
    const dialogRef = this.$dialog.open(SignUpComponent, {
      height: 'fit-content',
      maxHeight: '90vh',
      width: 'auto',
      data,
    });
    dialogRef.afterClosed().subscribe(success => {
      if (success === 'login') {
        this.onLogin();
      }
    });
  }

  onLogin(): void {
    const dialogRef = this.$dialog.open(LoginComponent, {
      height: 'fit-content',
      maxHeight: '90vh',
      width: 'auto'
    });
    dialogRef.afterClosed().subscribe(success => {
      if (success.createAccount && success.email) {
        this.onSignUp(success);
      }
    });
  }

}
