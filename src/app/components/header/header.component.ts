import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LangTranslateService } from 'src/app/services/lang-translate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private $translate: LangTranslateService,
    private $router: Router,
  ) { }

  ngOnInit(): void {
  }

  setLang(lang: string): void {
    // localStorage.setItem('selectedLanguage', lang);
    this.$translate.setLanguage(lang);
    const path = window.location.pathname;
    console.log(path.split('/'));
    const [a, langName, ...urls] = path.split('/');

    let url;
    if (!langName.match(/en|ar/)) {
      url = `/${lang}/${langName}/${urls.join('/')}`;
      url = url.slice(0, -1);
    } else {
      if (lang === 'en') {
        url = `/${urls.join('/')}`;
      } else {
        url = `/${lang}/${urls.join('/')}`;
      }
    }
    this.$router.navigateByUrl(url);

  }

}
