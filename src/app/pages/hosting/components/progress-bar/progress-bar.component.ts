import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, AfterViewInit, OnDestroy {

  // @Input() progress: string;
  progress: string;
  heading: string;

  isSaving = false;

  isSaveExitSubs: Subscription;
  constructor(
    private $ps: ProgressService
  ) { }

  ngOnInit(): void {
    this.isSaveExitSubs = this.$ps.header.subscribe(data => {
      this.progress = `${data.progress}%`;
      this.heading = data.heading;
    });
  }


  onSaveExit(): void {
    this.isSaving = true;
    this.$ps.isSaveExit.next(true);
    this.$ps.saveExit.next('done');
  }

  ngAfterViewInit(): void {
    this.$ps.isSaveExit
      .pipe(
        delay(0)
      )
      .subscribe(isSaving => {
        this.isSaving = isSaving;
      });
  }

  ngOnDestroy(): void {
    // this.$ps.isSaveExit.next(false);
    this.$ps.saveExit.next(null);
    this.isSaving = false;
    this.$ps.isSaveExit.next(false);
    this.isSaveExitSubs.unsubscribe();
  }

}
