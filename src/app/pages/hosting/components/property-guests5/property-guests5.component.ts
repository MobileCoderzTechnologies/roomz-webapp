import { Component, OnInit } from '@angular/core';
import { STEP_3_ROUTE, STEP_5_ROUTE } from '../../constansts/route.constant';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-property-guests5',
  templateUrl: './property-guests5.component.html',
  styleUrls: ['./property-guests5.component.scss']
})
export class PropertyGuests5Component implements OnInit {

  step5Route = STEP_5_ROUTE;
  step3Route = STEP_3_ROUTE;
  constructor(
    private $ps: ProgressService
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 18,
      heading: 'Property and guests'
    });
  }

}
