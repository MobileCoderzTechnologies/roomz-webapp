import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    private $http: HttpClient
  ) {
    this.getTranslate('en');

  }

  async getTranslate(selectedLanguage: string): Promise<void> {
    this.selectedLanguage = selectedLanguage;
    if (!this.content[selectedLanguage]) {
      const data = await this.$http.get(`/assets/translations/${selectedLanguage}.json`).toPromise();
      this.content[selectedLanguage] = data;
    }
  }

}
