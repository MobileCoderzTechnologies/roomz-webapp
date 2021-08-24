import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { MY_LISTING_ROUTE, STEP_1_ROUTE, STEP_3_ROUTE, STEP_4_ROUTE, STEP_5_ROUTE, STEP_7_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  step1Route = STEP_1_ROUTE;
  propertyId: number;
  encryptedPropertyId: string;
  constructor(
    private $ps: ProgressService,
    private $router: Router,
    private $alert: AlertService,
    private $encryptionService: EncryptionService,
    private $activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 2,
      heading: 'Property and guests'
    });

    this.$activatedRoute.params.subscribe(params => {
      const { id } = params;
      if (id) {
        this.encryptedPropertyId = id;
        this.propertyId = Number(this.$encryptionService.decrypt(id));
      }
      else {
        this.$ps.clearPropertyData();
      }
    });

    this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
      }
    });
  }


  onEditGoScreen(screen: string): void {
    if (screen === 'location') {
      this.$router.navigate([STEP_3_ROUTE.url, this.encryptedPropertyId]);
    }

    if (screen === 'building') {

    }

    if (screen === 'houserRules') {
      this.$router.navigate([STEP_7_ROUTE.url, this.encryptedPropertyId]);
    }

    if(screen === 'amenities'){
      this.$router.navigate([STEP_5_ROUTE.url, this.encryptedPropertyId])
    }
  }

}
