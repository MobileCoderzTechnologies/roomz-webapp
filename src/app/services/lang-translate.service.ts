import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  ) {
    let currentLanguage = window.location.pathname.split('/')[1];
    currentLanguage = currentLanguage.match(/en|ar/) ? currentLanguage : null;
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
