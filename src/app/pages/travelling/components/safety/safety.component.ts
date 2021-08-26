import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-safety',
  templateUrl: './safety.component.html',
  styleUrls: ['./safety.component.scss']
})
export class SafetyComponent implements OnInit {

  constructor(
    private $dialogRef: MatDialogRef<SafetyComponent>
  ) { }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.$dialogRef.close(null);
  }

}
