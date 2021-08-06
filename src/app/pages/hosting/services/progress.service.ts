import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  public header = new BehaviorSubject({
    progress: 1,
    heading: 'Property and guests'
  });

  public propertyData = new BehaviorSubject<any>(null);
  constructor(
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.getSavedPropertyData();
  }

  private getSavedPropertyData(): void {
    if (isPlatformBrowser(this.platformId)) {
      const isSavedPropertyData = localStorage.getItem('propertyData');
      if (isSavedPropertyData) {
        this.propertyData.next(JSON.parse(isSavedPropertyData));
      }
    }
  }

  setPropertyData(data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('propertyData', JSON.stringify(data));
      this.getSavedPropertyData();
    }
  }

  clearPropertyData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('propertyData');
    }
  }

}
