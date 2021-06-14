import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LangTranslateService } from './lang-translate.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl = environment.apiUrl;

  private selectedLanguage = this.$translate.selectedLanguage;
  private headers = new HttpHeaders();
  constructor(
    private $http: HttpClient,
    private $router: Router,
    private $translate: LangTranslateService,
  ) {
    this.headers = this.headers.set('Accept-Language', this.selectedLanguage);
  }

  get(url: string, params?: any): Observable<any> {
    return this.$http.get<any>(
      `${this.baseUrl}${url}`,
      {
        params,
        headers: this.headers
      }
    ).pipe(
      catchError(this.errorHandler.bind(this))
    );
  }

  post(url: string, data: any, options: any = {}): Observable<any> {
    options.headers = this.headers;
    return this.$http.post<any>(
      `${this.baseUrl}${url}`,
      data,
      options
    ).pipe(
      catchError(this.errorHandler.bind(this))
    );
  }

  put(url: string, data: any, options: any = {}): Observable<any> {
    options.headers = this.headers;
    return this.$http.put<any>(
      `${this.baseUrl}${url}`,
      data,
      options
    ).pipe(
      catchError(this.errorHandler.bind(this))
    );
  }

  patch(url: string, data: any, options: any = {}): Observable<any> {
    options.headers = this.headers;
    return this.$http.patch<any>(
      `${this.baseUrl}${url}`,
      data,
      options
    ).pipe(
      catchError(this.errorHandler.bind(this))
    );
  }

  delete(url: string, params?: any): Observable<any> {
    return this.$http.delete(
      `${this.baseUrl}${url}`,
      {
        params,
        headers: this.headers
      }
    )
      .pipe(
        catchError(this.errorHandler.bind(this))
      );
  }



  private errorHandler(response: any): Observable<{ error: string, message: string }> {

    console.log(response);
    const error = response.error;
    let message;
    const status = response.status;
    message = error.message;
    if (error.isTrusted) {
      message = 'No Internet Connection';
    }
    if (status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      this.$router.navigate(['/login']);
    }
    const err = { error, message };
    return throwError(err);
  }
}



