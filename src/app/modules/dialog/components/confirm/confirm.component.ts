import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor(
    private $dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialog
  ) { }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.$dialogRef.close(true);
  }

  onCancel(): void {
    this.$dialogRef.close(false);
  }

}

export interface ConfirmDialog {
  message: string;
  yBtnTxt: string;
  nBtnTxt: string;
}
