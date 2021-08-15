import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Amenity } from 'src/app/modals/amenity.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { LISTING_HOME_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss'],
})
export class PropertyListComponent implements OnInit, AfterViewInit {
  encryptedPropertyId: string;
  propertyId: number;

  isLoading = false;

  page = 1;
  pageSize = 10;
  totalCount = 0;

  properties: any = [];


  amenities: Amenity[];

  filter: 0 | 1 | 2 | 3 = 0;

  beds = 0;
  bedrooms = 0;
  bathrooms = 0;

  no_of_beds = 0;
  no_of_bedrooms = 0;
  no_of_bathrooms = 0;

  listingStatus = {
    inProgress: 1,
    listed: 2,
    unlisted: 3
  };

  propertyStatus: {
    1: 'In Progress',
    2: 'Listed',
    3: 'Unlisted'
  };

  selectedStatus: number[] = [];
  applyStatus = '';


  selectedAmenities: number[] = [];

  applyAmenities = '';

  search = '';

  @ViewChild('search') searchElement: any;

  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $router: Router,
    private $activatedRoute: ActivatedRoute,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService,
  ) { }

  ngOnInit(): void {
    this.getAmenities();
    this.getMyPropertyList();
  }

  ngAfterViewInit(): void {
    this.onSearch();
  }


  private onSearch(): void {
    fromEvent<any>(this.searchElement.nativeElement, 'input').pipe(
      debounceTime(500)
    )
      .subscribe(event => {
        const searchTxt = event.target.value;

        if (searchTxt.trim()) {
          this.search = searchTxt;
          this.getMyPropertyList();
        }
      });
  }


  private getAmenities(): void {
    this.$propertyListingService.getAmenities().subscribe(data => {
      this.amenities = data.data;
    }, err => {
      this.$alert.danger(err.message);
    });
  }


  onCreateListing(): void {
    this.$router.navigateByUrl(LISTING_HOME_ROUTE.url);
  }

  clearsBedAndRooms(): void {
    this.bedrooms = this.beds = this.no_of_beds = this.no_of_bathrooms = this.no_of_bedrooms = this.bathrooms = 0;
  }

  applyBedAndRooms(): void {
    this.no_of_bedrooms = this.bedrooms;
    this.no_of_beds = this.beds;
    this.no_of_bathrooms = this.bathrooms;
    this.filter = 0;
    this.getMyPropertyList();
  }


  onCheckAmenity(isChecked: boolean, amenityId: number): void {
    if (isChecked) {
      this.selectedAmenities.push(Number(amenityId));
    }
    else {
      this.selectedAmenities = this.selectedAmenities.filter(e => e !== Number(amenityId));
    }
  }


  applyAmenitiesFilter(): void {
    this.applyAmenities = this.selectedAmenities.join(',');
    this.filter = 0;
    this.getMyPropertyList();
  }

  clearAmenityFilter(): void {
    this.selectedAmenities = [];
  }

  markCheckOnAmenity(amenityId: number): boolean {
    if (this.selectedAmenities.includes(amenityId)) {
      return true;
    }
    return false;
  }

  markFilter3(isChecked: boolean, status: string): void {
    if (isChecked) {
      this.selectedStatus.push(this.listingStatus[status]);
    }
    else {
      this.selectedStatus = this.selectedStatus.filter(e => e !== this.listingStatus[status]);
    }
  }

  applyFilter3(): void {
    this.applyStatus = this.selectedStatus.join(',');
    this.filter = 0;
    this.getMyPropertyList();
  }


  clearFilter3(): void {
    this.selectedStatus = [];
  }

  markCheckOnFilter3(status: string): boolean {
    if (this.selectedStatus.includes(this.listingStatus[status])) {
      return true;
    }
    return false;
  }





  private getMyPropertyList(): void {
    this.isLoading = true;

    this.$propertyListingService.getMyProperties(
      this.page,
      this.pageSize,
      this.applyStatus,
      this.no_of_beds,
      this.no_of_bedrooms,
      this.no_of_bathrooms,
      this.applyAmenities,
      this.search
    )
      .subscribe(data => {
        console.log(data);
        this.isLoading = false;
        this.properties = data.data.data;
        this.totalCount = data.data.meta.total;
      },
        err => {
          this.isLoading = false;
          this.$alert.danger(err.message);
        });
  }


}
