import { Component, OnInit } from '@angular/core';
import { STEP_2_ROUTE, STEP_4_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-property-guests4',
  templateUrl: './property-guests4.component.html',
  styleUrls: ['./property-guests4.component.scss']
})
export class PropertyGuests4Component implements OnInit {

  step2Route = STEP_2_ROUTE;
  step4Route = STEP_4_ROUTE;
  constructor(
    private $ps: ProgressService,
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 15,
      heading: 'Property and guests'
    });
  }

}
