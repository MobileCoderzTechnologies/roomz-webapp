import { Component, OnInit } from '@angular/core';
import { STEP_1_ROUTE } from '../../constansts/route.constant';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  step1Route = STEP_1_ROUTE;
  constructor(
    private $ps: ProgressService
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 2,
      heading: 'Property and guests'
    });
  }

}
