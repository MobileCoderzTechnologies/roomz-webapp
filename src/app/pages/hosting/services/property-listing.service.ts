import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Amenity } from 'src/app/modals/amenity.modal';
import { BedType } from 'src/app/modals/bed-type.modal';
import { HomeDetail } from 'src/app/modals/home-detail.modal';
import { HouseRule } from 'src/app/modals/house-rule.modal';
import { PropertyType } from 'src/app/modals/property-type.modal';
import { HttpService } from 'src/app/services/http.service';
import {
  DELETE_IMAGE,
  GET_AMENITIES,
  GET_BED_TYPES,
  GET_HOME_DETAILS,
  GET_HOME_RULES,
  GET_PROPERTY_TYPES,
  MY_PROFILE,
  PROPERTY_ADDRESS,
  PROPERTY_AMENITIES,
  PROPERTY_BEDS,
  PROPERTY_DESCRIPTION,
  PROPERTY_DETAILS,
  PROPERTY_GUEST_REQUIREMENTS,
  PROPERTY_HOUSE_RULES,
  PROPERTY_LOCATION,
  PROPERTY_NAME,
  PROPERTY_PHONE_NUMBER,
  PROPERTY_PHOTOS,
  PROPERTY_TYPE,
  RESEND_OTP,
  UPLOAD_IMAGE,
  USER_PHONE_NUMBER,
  UPDATE_PROFILE_PHOTO,
  PROPERTY_AVAILABILITY,
  PROPERTY_PRICING,
  PROPERTY_LAWS_AND_CALENDER,
  PROPERTY_QUESTIONS,
  PROPERTY_PREVIEW,
  PROPERTY_PUBLISH,
  PROPERTY_DISCOUNTS,
  MY_PROPERTIES
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

  getHomeDetails(): Observable<{ data: HomeDetail[] }> {
    return this.$http.get(GET_HOME_DETAILS);
  }

  getHomeRules(): Observable<{ data: HouseRule[] }> {
    return this.$http.get(GET_HOME_RULES);
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

  addPropertyAmenities(id: number, data: { amenities: number[] }): Observable<any> {
    return this.$http.put(`${PROPERTY_AMENITIES}/${id}`, data);
  }

  addGuestRequirements(id: number, data: { [key: string]: boolean }): Observable<any> {
    return this.$http.put(`${PROPERTY_GUEST_REQUIREMENTS}/${id}`, data);
  }

  addHouseRules(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_HOUSE_RULES}/${id}`, data);
  }

  addPropertyDetails(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_DETAILS}/${id}`, data);
  }

  uploadPhotos(data: FormData): Observable<{ data: { image_url: string }[] }> {
    return this.$http.post(UPLOAD_IMAGE, data);
  }

  removePhotos(data: any): Observable<any> {
    return this.$http.post(DELETE_IMAGE, data);
  }

  addPropertyPhotos(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_PHOTOS}/${id}`, data);
  }

  addPropertyDescription(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_DESCRIPTION}/${id}`, data);
  }

  addPropertyName(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_NAME}/${id}`, data);
  }


  getUser(): Observable<any> {
    return this.$http.get(MY_PROFILE);
  }

  resendOtp(data: any): Observable<any> {
    return this.$http.post(RESEND_OTP, data);
  }

  userPhoneNumber(data: any): Observable<any> {
    return this.$http.put(USER_PHONE_NUMBER, data);
  }

  userProfilePhoto(data: FormData): Observable<any> {
    return this.$http.post(UPDATE_PROFILE_PHOTO, data);
  }

  addSecPhoneNumber(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_PHONE_NUMBER}/${id}`, data);
  }
  addSecPropertyAvailability(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_AVAILABILITY}/${id}`, data);
  }

  addSecPropertyPrice(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_PRICING}/${id}`, data);
  }

  lawsAndCalenderMark(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_LAWS_AND_CALENDER}/${id}`, data);
  }
  setPropertyQuestions(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_QUESTIONS}/${id}`, data);
  }
  setLongTermDiscounts(id: number, data: any): Observable<any> {
    return this.$http.put(`${PROPERTY_DISCOUNTS}/${id}`, data);
  }


  getPropertyPreview(id: number): Observable<any> {
    return this.$http.get(`${PROPERTY_PREVIEW}/${id}`);
  }
  publishProperty(id: number): Observable<any> {
    return this.$http.get(`${PROPERTY_PUBLISH}/${id}`);
  }

  getMyProperties(
    page = 1,
    pageSize = 10,
    status = '',
    beds = 0,
    bedrooms = 0,
    bathrooms = 0,
    amenities = '',
    search = ''
  ): Observable<any> {
    let params = new HttpParams();
    params = params.set('page', page.toString());
    params = params.set('pageSize', pageSize.toString());
    params = params.set('beds', beds.toString());
    params = params.set('bedrooms', bedrooms.toString());
    params = params.set('bathrooms', bathrooms.toString());
    params = params.set('status', status);
    params = params.set('amenities', amenities);
    params = params.set('search', search);

    return this.$http.get(MY_PROPERTIES, { params });
  }






}



