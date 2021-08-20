import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Amenity } from 'src/app/modals/amenity.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import Swal from 'sweetalert2';
import { LISTING_HOME_ROUTE, STEP_1_ROUTE } from '../../constants/route.constant';
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
    pendingForApproval: 2,
    listed: 3,
    unlisted: 4,
    blocked: 5
  };


  selectedStatus: number[] = [];
  applyStatus = '';


  selectedAmenities: number[] = [];

  applyAmenities = '';

  search = '';

  searchElement: any;
  deletingProperties: number[] = [];

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
    // this.onSearch();
  }


  onSearch(event): void {
    // this.searchElement = document.getElementById('search');
    // fromEvent<any>(this.searchElement, 'input').pipe(
    //   debounceTime(500)
    // )
    //   .subscribe(event => {
    //   });
    const searchTxt = event.target.value;

    if (searchTxt.trim()) {
      this.search = searchTxt;
      this.getMyPropertyList();
    }

    if (!searchTxt) {
      this.search = '';
      this.getMyPropertyList();
    }
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


  editProperty(propertyId: number): void {
    this.$propertyListingService.getPropertyDataForUpdate(propertyId).subscribe(data => {
      const resData = data.property[0];
      console.log(resData);
      const propertyData = {
        property: resData,
        amenities: resData.amenities.map(e => e = e.amenity_id),
        houseRules: resData.rules,
        beds: resData.beds,
        details: resData.details.map(e => {
          return {
            detail_id: e.detail_id,
            explanation: e.explanation,
          };
        }),
        images: resData.images,
      };

      delete propertyData.property.amenities;
      delete propertyData.property.rules;
      delete propertyData.property.beds;
      delete propertyData.property.details;
      delete propertyData.property.images;

      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(propertyData);

      const encryptedPropertyId = this.$encryptionService.encrypt(propertyId);

      this.$router.navigate([STEP_1_ROUTE.url, encryptedPropertyId]);
    },
      err => {
        this.$alert.danger(err.message);
      });
  }

  onPageChange(event): void {
    this.page = event;
    this.getMyPropertyList();
  }

  onChecked(isChecked: boolean, propertyId): void {
    if (isChecked) {
      this.deletingProperties.push(propertyId);
    }
    else {
      this.deletingProperties = this.deletingProperties.filter(e => e !== propertyId);
    }
  }

  onDelete(): void {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        const ids = this.deletingProperties.join(',');
        this.$propertyListingService.deleteProperties(ids).subscribe(data => {
          this.$alert.success(data.message);
          this.getMyPropertyList();
          this.deletingProperties = [];
        });
      }
    });

  }


}
