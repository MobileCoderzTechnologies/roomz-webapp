import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BedType } from 'src/app/modals/bed-type.modal';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_1_ROUTE, STEP_3_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests2',
  templateUrl: './property-guests2.component.html',
  styleUrls: ['./property-guests2.component.scss']
})
export class PropertyGuests2Component implements OnInit {

  step1Route = STEP_1_ROUTE;
  step3Route = STEP_3_ROUTE;
  propertyId: number;

  bedTypes: BedType[];

  numberOfBedrooms = 0;
  numberOfGuests = 0;
  numberOfBathrooms = 0;

  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $activatedRoute: ActivatedRoute,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 12,
      heading: 'Property and guests'
    });

    this.getBedTypes();
    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });

  }


  private getBedTypes(): void {
    this.$propertyListingService.getBedTypes().subscribe(data => {
      this.bedTypes = data.data;
    }, err => {
      this.$alert.danger(err.message);
    });
  }






}
