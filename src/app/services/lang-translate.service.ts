import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LangTranslateService {


  public selectedLanguage = 'en';
  content: any = {};
  get data(): any {
    return this.content[this.selectedLanguage];
  }

  constructor(
    private $http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    let currentLanguage = null;
    if (isPlatformBrowser(this.platformId)) {
      currentLanguage = window.location.pathname.split('/')[1];
      currentLanguage = currentLanguage.match(/en|ar/) ? currentLanguage : null;
    }
    if (!currentLanguage) {
      this.getTranslate('en');
    } else {
      this.selectedLanguage = currentLanguage;
      this.getTranslate(this.selectedLanguage);
    }
  }

  async getTranslate(selectedLanguage: string): Promise<void> {
    this.selectedLanguage = selectedLanguage;
    if (!this.content[selectedLanguage]) {
      const data = await this.$http.get(`/assets/translations/${selectedLanguage}.json`).toPromise();
      this.content[selectedLanguage] = data;
    }
  }

  setLanguage(language: string): void {
    this.getTranslate(language);
  }

}
