import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-guest-requirement-model',
  templateUrl: './guest-requirement-model.component.html',
  styleUrls: ['./guest-requirement-model.component.scss']
})
export class GuestRequirementModelComponent implements OnInit {

  showRequirement: {
    [key: string]: boolean;
  } = {};
  constructor(
    private $dialogRef: MatDialogRef<GuestRequirementModelComponent>,
    @Inject(MAT_DIALOG_DATA) public guestRequirement: GuestRequirement
  ) {
    this.showRequirement = { ...guestRequirement };
  }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.$dialogRef.close(null);
  }

  onSave(): void {
    this.$dialogRef.close(this.guestRequirement);
  }


}


interface GuestRequirement {
  isIdSubmitted: boolean;
  isEmailConfirmed: boolean;
  isPhoneConfirmed: boolean;
  isPaymentInformation: boolean;
  isTripPurpose: boolean;
  isAgreeHR: boolean;
  isRecommendedFromOH: boolean;
}