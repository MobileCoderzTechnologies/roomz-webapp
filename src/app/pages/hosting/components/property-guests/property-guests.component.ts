import { Component, OnInit } from '@angular/core';
import { START_ROUTE, STEP_2_ROUTE } from '../../constansts/route.constant';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-property-guests',
  templateUrl: './property-guests.component.html',
  styleUrls: ['./property-guests.component.scss']
})
export class PropertyGuestsComponent implements OnInit {

  startRoute = START_ROUTE;
  step2Route = STEP_2_ROUTE;
  constructor(
    private $ps: ProgressService
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 10,
      heading: 'Property and guests'
    });
  }

}
