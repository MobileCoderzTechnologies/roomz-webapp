import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private $dialogRef: MatDialogRef<WelcomeComponent>
  ) { }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.$dialogRef.close();
  }

  onContinue(): void {
    this.$dialogRef.close(true);
  }
}
