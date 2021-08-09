import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Amenity } from 'src/app/modals/amenity.modal';
import { BedType } from 'src/app/modals/bed-type.modal';
import { HomeDetail } from 'src/app/modals/home-detail.modal';
import { PropertyType } from 'src/app/modals/property-type.modal';
import { HttpService } from 'src/app/services/http.service';
import {
  GET_AMENITIES,
  GET_BED_TYPES,
  GET_HOME_DETAILS,
  GET_PROPERTY_TYPES,
  PROPERTY_ADDRESS,
  PROPERTY_AMENITIES,
  PROPERTY_BEDS,
  PROPERTY_GUEST_REQUIREMENTS,
  PROPERTY_HOUSE_RULES,
  PROPERTY_LOCATION,
  PROPERTY_TYPE
} from '../constants/api.constant';

@Injectable({
  providedIn: 'root'
})
export class PropertyListingService {

  constructor(
    private $http: HttpService
  ) { }

  getPropertyTypes(): Observable<{ data: PropertyType[] }> {
    return this.$http.get(GET_PROPERTY_TYPES);
  }

  getAmenities(): Observable<{ data: Amenity[] }> {
    return this.$http.get(GET_AMENITIES);
  }

  getBedTypes(): Observable<{ data: BedType[] }> {
    return this.$http.get(GET_BED_TYPES);
  }

  getHomeDetails(): Observable<{ data: HomeDetail }> {
    return this.$http.get(GET_HOME_DETAILS);
  }

  addPropertyType(data: any, id = null): Observable<any> {
    let url = PROPERTY_TYPE;
    if (id) {
      url = `${PROPERTY_TYPE}/${id}`;
    }
    return this.$http.post(url, data);
  }

  addPropertyBeds(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_BEDS}/${id}`, data);
  }

  addPropertyAddress(id: number, data: { [key: string]: string }): Observable<any> {
    return this.$http.put(`${PROPERTY_ADDRESS}/${id}`, data);
  }

  addPropertyLocation(id: number, data: { [key: string]: string | number }): Observable<any> {
    return this.$http.put(`${PROPERTY_LOCATION}/${id}`, data);
  }

  addPropertyAmenities(id: number, data: {amenities: number[]}): Observable<any> {
    return this.$http.put(`${PROPERTY_AMENITIES}/${id}`, data);
  }

  addGuestRequirements(id: number, data: { [key: string]: boolean }): Observable<any> {
    return this.$http.put(`${PROPERTY_GUEST_REQUIREMENTS}/${id}`, data);
  }

  addHouseRules(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_HOUSE_RULES}/${id}`, data);
  }
}

