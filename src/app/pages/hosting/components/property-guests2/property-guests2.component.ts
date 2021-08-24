import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BedType } from 'src/app/modals/bed-type.modal';
import { PropertyBed } from 'src/app/modals/property-bed.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_1_ROUTE, STEP_3_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests2',
  templateUrl: './property-guests2.component.html',
  styleUrls: ['./property-guests2.component.scss']
})
export class PropertyGuests2Component implements OnInit, AfterViewInit, OnDestroy {

  step1Route = STEP_1_ROUTE;
  step3Route = STEP_3_ROUTE;
  propertyId: number;
  encryptedPropertyId: string;
  bedTypes: BedType[];

  bedTypeObj: { [key: string]: string } = {};

  numberOfBedrooms = 1;
  numberOfGuests = 1;
  numberOfBathrooms = 1;

  bedRoomCountArr: number[] = [0, 1];
  propertyDataSubs: Subscription;
  propertyData: any;

  bedroom = bedroom;

  propertyBeds: PropertyBed[] = [
    {
      bed_id: 4,
      bedroom_name: 'Common Space',
      count: 2,
      serial_number: 0
    },
    {
      bed_id: 7,
      bedroom_name: 'Common Space',
      count: 3,
      serial_number: 0
    },
    {
      bed_id: 9,
      bedroom_name: 'Common Space',
      count: 1,
      serial_number: 0
    },
    {
      bed_id: 1,
      bedroom_name: 'Bedroom 1',
      count: 2,
      serial_number: 1
    },
    {
      bed_id: 2,
      bedroom_name: 'Bedroom 2',
      count: 3,
      serial_number: 1
    },
    {
      bed_id: 3,
      bedroom_name: 'Bedroom 3',
      count: 1,
      serial_number: 1
    }
  ];

  bedGroup: {
    [key: string]: {
      beds: PropertyBed[];
      isEdit: boolean;
      done: boolean;
    }
  } = {};

  isNextLoading = false;

  saveExitSubs: Subscription;

  isSavingExit = false;

  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $activatedRoute: ActivatedRoute,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService,
    private $router: Router
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 15,
      heading: 'Property and guests'
    });
    this.getBedTypes();
    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

    this.saveExitSubs = this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.isSavingExit = true;
        this.addPropertyBeds();
      }
    });
  }

  ngAfterViewInit(): void {
    this.setDataForUpdate();
  }


  private setDataForUpdate(): void {
    this.propertyDataSubs = this.$ps.propertyData
      .pipe(
        delay(0)
      )
      .subscribe(data => {
        this.propertyData = data;
        console.log(this.propertyData);
        if (this.propertyData) {
          this.numberOfBathrooms = this.propertyData.property.no_of_bathrooms || 1;
          this.numberOfBedrooms = this.propertyData.property.no_of_bedrooms || 1;
          this.numberOfGuests = this.propertyData.property.no_of_guests || 1;
          if (this.propertyData?.beds?.length) {
            this.propertyBeds = this.propertyData.beds;
            this.bedRoomCountArr = [];
            for (let i = 0; i <= this.numberOfBedrooms; i++) {
              this.bedRoomCountArr.push(i);
            }
          }
          this.groupBeds(this.propertyBeds);
        }
      });
  }

  private groupBeds(beds: PropertyBed[]): void {
    this.bedGroup = {};
    beds.forEach((bed) => {
      const keys = Object.keys(this.bedGroup);
      if (keys.includes(`${bed.serial_number}`)) {
        this.bedGroup[bed.serial_number].beds.push(bed);
        this.bedGroup[bed.serial_number].isEdit = true;
        this.bedGroup[bed.serial_number].done = false;
      }
      else {
        this.bedGroup[bed.serial_number] = {
          beds: [bed],
          isEdit: true,
          done: false,
        };
      }
    });
  }

  private getBedTypes(): void {
    this.$propertyListingService.getBedTypes().subscribe(data => {
      this.bedTypes = data.data;
      this.bedTypes.forEach(item => {
        this.bedTypeObj[item.id] = item.bed_type;
      });
    }, err => {
      this.$alert.danger(err.message);
    });
  }

  numberOfBedroomsIncDec(type: 'inc' | 'dec'): void {
    if (type === 'inc') {
      this.numberOfBedrooms += 1;
      // this.bedGroup[this.numberOfBedrooms] = {
      //   beds: [],
      //   isEdit: false,
      //   done: true,
      // };
      this.bedRoomCountArr.push(this.numberOfBedrooms);
      const beds = [...this.bedroom];
      beds.forEach(item => {
        item.bedroom_name = `BedRoom ${this.numberOfBedrooms}`;
        item.count = 2;
        item.serial_number = this.numberOfBedrooms;
        this.propertyBeds.push({ ...item });
      });

      this.groupBeds(this.propertyBeds);
    }

    if (type === 'dec') {
      delete this.bedGroup[this.numberOfBedrooms];
      this.numberOfBedrooms -= 1;
      this.propertyBeds = this.propertyBeds.filter(e => e.serial_number !== this.numberOfBedrooms);
      this.bedRoomCountArr.pop();
    }
  }


  editRoom(roomNo: number): void {
    this.bedGroup[roomNo].isEdit = false;
  }

  doneRoom(roomNo: number): void {
    this.bedGroup[roomNo].isEdit = true;
  }



  addAnotherBed(bedId: number, roomNo: number): void {
    const obj = {
      bed_id: bedId,
      serial_number: roomNo,
      bedroom_name: `Bedroom ${roomNo}`,
      count: 1
    };
    const isBedPresent = this.bedGroup[roomNo].beds.some(e => e.bed_id === Number(bedId));
    if (!isBedPresent) {
      this.bedGroup[roomNo].beds.push(obj);
    }
  }

  countBedsInRoom(bedId: number, roomNo: number, type: 'inc' | 'dec'): void {
    if (this.bedGroup[roomNo].beds.length === 1 && this.bedGroup[roomNo].beds[0].count === 1) {
      if(roomNo === 0){
        this.$alert.info('Should be 1 bed in common space');
      }
      else{
        this.$alert.info('Should be 1 bed in a bedroom');
      }
      return;
    }
    this.bedGroup[roomNo].beds = this.bedGroup[roomNo].beds.map(item => {
      if (item.bed_id === bedId) {
        if (type === 'inc') {
          item.count += 1;
        }
        else {
          item.count -= 1;
        }
      }
      return item;
    })
      .filter(e => e.count !== 0);


  }


  private selectedBeds(): PropertyBed[] {
    const beds: PropertyBed[] = [];
    Object.keys(this.bedGroup).forEach(key => {
      beds.push(...this.bedGroup[key].beds);
    });
    return beds;
  }

  addPropertyBeds(): void {
    this.isNextLoading = true;
    const requestData = {
      no_of_guests: this.numberOfGuests,
      no_of_bedrooms: this.numberOfBedrooms,
      no_of_bathrooms: this.numberOfBathrooms,
      beds: this.selectedBeds()
    };
    this.$propertyListingService.addPropertyBeds(this.propertyId, requestData).subscribe(data => {
      this.isNextLoading = false;
      const respData = data.data[0];
      const beds = respData.beds;
      this.propertyData.property.no_of_bathrooms = respData.no_of_bathrooms;
      this.propertyData.property.no_of_bedrooms = respData.no_of_bedrooms;
      this.propertyData.property.no_of_guests = respData.no_of_guests;
      this.propertyData.beds = beds;

      console.log(this.propertyData);
      this.$ps.clearPropertyData();
      this.$ps.setPropertyData(this.propertyData);
      if (this.isSavingExit) {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
        return;
      }
      this.$router.navigate([this.step3Route.url, this.encryptedPropertyId]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }


  ngOnDestroy(): void {
    this.propertyDataSubs.unsubscribe();
    this.saveExitSubs.unsubscribe();
  }

}



const bedroom = [
  {
    bed_id: 3,
    bedroom_name: 'Bedroom 1',
    count: 2,
    serial_number: 1
  },
  {
    bed_id: 5,
    bedroom_name: 'Bedroom 2',
    count: 2,
    serial_number: 1
  },
  {
    bed_id: 9,
    bedroom_name: 'Bedroom 3',
    count: 1,
    serial_number: 1
  }
];
