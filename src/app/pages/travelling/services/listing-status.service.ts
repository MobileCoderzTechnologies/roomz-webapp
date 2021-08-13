import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { LISTING_STATUS } from '../constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class ListingStatusService {

  constructor(
    private $http: HttpService
  ) { }

  getListingStatus(): Observable<any> {
    return this.$http.get(LISTING_STATUS);
  }
}
