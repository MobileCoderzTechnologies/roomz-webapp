import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_21_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';
import { PropertyListingService } from '../../services/property-listing.service';

@Component({
  selector: 'app-property-guests28',
  templateUrl: './property-guests28.component.html',
  styleUrls: ['./property-guests28.component.scss']
})
export class PropertyGuests28Component implements OnInit {

  step21Route = STEP_21_ROUTE;
  myListingRoute = MY_LISTING_ROUTE;

  isNextLoading = false;

  encryptedPropertyId: string;
  propertyId: number;

  constructor(
    private $ps: ProgressService,
    private $encryptionService: EncryptionService,
    private $router: Router,
    private $activatedRoute: ActivatedRoute,
    private $propertyListingService: PropertyListingService,
    private $alert: AlertService,
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 99,
      heading: 'Property and Guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      this.encryptedPropertyId = id;
      this.propertyId = Number(this.$encryptionService.decrypt(id));
    });
  }


  onPublish(): void {
    this.isNextLoading = true;

    this.$propertyListingService.publishProperty(this.propertyId).subscribe(res => {
      this.$ps.clearPropertyData();
      this.isNextLoading = false;
      this.$alert.success(res.message);
      this.$router.navigate([this.myListingRoute.url]);
    }, err => {
      this.isNextLoading = false;
      this.$alert.danger(err.message);
    });
  }




}
