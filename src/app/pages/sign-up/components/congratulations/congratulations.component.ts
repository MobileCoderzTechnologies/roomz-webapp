import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.scss']
})
export class CongratulationsComponent implements OnInit {

  @Input() dialogRef: any;
  constructor() { }

  ngOnInit(): void {
  }

  startExploring(): void {
    this.dialogRef.close(null);
  }

}
