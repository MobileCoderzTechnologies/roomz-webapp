import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cancellation-policy',
  templateUrl: './cancellation-policy.component.html',
  styleUrls: ['./cancellation-policy.component.scss']
})
export class CancellationPolicyComponent implements OnInit {

  constructor(
    private $dialogRef: MatDialogRef<CancellationPolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public cancellationPolicy: any
  ) { }

  ngOnInit(): void {
    console.log(this.cancellationPolicy);
  }

  closeDialog(): void {
    this.$dialogRef.close(null);
  }

}
