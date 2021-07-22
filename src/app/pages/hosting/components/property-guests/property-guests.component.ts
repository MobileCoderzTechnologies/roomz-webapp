import { Component, OnInit } from '@angular/core';
import { START_ROUTE } from '../../constansts/route.constant';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-property-guests',
  templateUrl: './property-guests.component.html',
  styleUrls: ['./property-guests.component.scss']
})
export class PropertyGuestsComponent implements OnInit {

  startRoute = START_ROUTE;
  constructor(
    private $ps: ProgressService
  ) { }

  ngOnInit(): void {
    this.$ps.progress.next(10);
  }

}
