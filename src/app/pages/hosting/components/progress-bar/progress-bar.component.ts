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
  constructor(
    private $progressService: ProgressService
  ) { }

  ngOnInit(): void {
    this.$progressService.progress.subscribe(progress => this.progress = `${progress}%`);
  }

}
