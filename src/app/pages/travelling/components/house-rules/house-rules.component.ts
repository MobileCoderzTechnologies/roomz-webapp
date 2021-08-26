import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-house-rules',
  templateUrl: './house-rules.component.html',
  styleUrls: ['./house-rules.component.scss']
})
export class HouseRulesComponent implements OnInit {

  rules: any[] = [];
  additionalRules: any[] = [];

  constructor(
    private $dialogRef: MatDialogRef<HouseRulesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rules: any[]; checkIn: number; checkOut: number },
  ) { }

  ngOnInit(): void {
    console.log(this.rules);
    this.data.rules.forEach(rule => {
      if (rule?.is_additional) {
        this.additionalRules.push(rule);
      }
      else {
        this.rules.push(rule);
      }
    });
  }

  closeDialog(): void {
    this.$dialogRef.close(null);
  }

}
