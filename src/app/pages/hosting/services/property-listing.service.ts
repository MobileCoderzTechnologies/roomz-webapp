import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PropertyType } from 'src/app/modals/property-type.modal';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyListingService {

  constructor(
    private $http: HttpService
  ) { }

  getPropertyTypes(): Observable<any> {
    return this.$http.get('user/hosting/property-types');
  }
}
