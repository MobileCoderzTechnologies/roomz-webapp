import { Component, Input, OnInit } from '@angular/core';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  // @Input() progress: string;
  progress: string;
  heading: string;
  constructor(
    private $ps: ProgressService
  ) { }

  ngOnInit(): void {
    this.$ps.header.subscribe(data => {
      this.progress = `${data.progress}%`;
      this.heading = data.heading;
    });
  }

}
