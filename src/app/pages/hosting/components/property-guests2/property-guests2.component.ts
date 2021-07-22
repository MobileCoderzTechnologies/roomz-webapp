import { Component, OnInit } from '@angular/core';
import { STEP_1_ROUTE, STEP_3_ROUTE } from '../../constansts/route.constant';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-property-guests2',
  templateUrl: './property-guests2.component.html',
  styleUrls: ['./property-guests2.component.scss']
})
export class PropertyGuests2Component implements OnInit {

  step1Route = STEP_1_ROUTE;
  step3Route = STEP_3_ROUTE;
  constructor(
    private $ps: ProgressService
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 12,
      heading: 'Property and guests'
    });
  }

}
