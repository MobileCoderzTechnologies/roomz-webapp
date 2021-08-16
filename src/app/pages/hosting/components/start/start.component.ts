import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MY_LISTING_ROUTE, STEP_1_ROUTE } from '../../constants/route.constant';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  step1Route = STEP_1_ROUTE;
  constructor(
    private $ps: ProgressService,
    private $router: Router
  ) { }

  ngOnInit(): void {
    this.$ps.header.next({
      progress: 2,
      heading: 'Property and guests'
    });

    this.$ps.saveExit.subscribe(data => {
      if (data === 'done') {
        this.$router.navigateByUrl(MY_LISTING_ROUTE.url);
      }
    });
  }

}
