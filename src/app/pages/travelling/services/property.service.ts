import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { PROPERTY_DETAILS, SEARCH_PROPERTY } from '../constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(
    private $http: HttpService
  ) { }

  getSearchedProperties(
    page = 1,
    pageSize = 10,
    search = ''
  ): Observable<any> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    params = params.set('search', search);
    return this.$http.get(SEARCH_PROPERTY, params);
  }

  getPropertyDetails(id: number): Observable<any> {
    return this.$http.get(`${PROPERTY_DETAILS}/${id}`);
  }
}
