import { Component, OnInit } from '@angular/core';
import { EncryptionService } from 'src/app/services/encryption.service';
import { STEP_4_ROUTE, STEP_6_ROUTE } from '../../constansts/route.constant';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-property-guests6',
  templateUrl: './property-guests6.component.html',
  styleUrls: ['./property-guests6.component.scss']
})
export class PropertyGuests6Component implements OnInit {

  step6Route = STEP_6_ROUTE;
  step4Route = STEP_4_ROUTE;

  constructor(
    private $ps: ProgressService,
    private $es: EncryptionService
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 23,
      heading: 'Property and guests'
    });
  }

}
