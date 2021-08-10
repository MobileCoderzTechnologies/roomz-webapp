import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertyHouseRule } from 'src/app/modals/property-house-rule.modal';

@Component({
  selector: 'app-rule-reason-model',
  templateUrl: './rule-reason-model.component.html',
  styleUrls: ['./rule-reason-model.component.scss']
})
export class RuleReasonModelComponent implements OnInit {

  cancelReason = new FormControl(null, [Validators.required, Validators.minLength(10)]);

  rule: PropertyHouseRule;
  ruleLineObj = {
    1: 'Explain why your listing isn’t suitable for children',
    2: 'Explain why your listing isn’t suitable for infants',
    3: 'Explain why your listing isn’t suitable for pets',
    4: 'Explain why your listing isn’t allow for smoking',
    5: 'Explain why your listing isn’t allow for events',
  }

  constructor(
    private $dialogRef: MatDialogRef<RuleReasonModelComponent>,
    @Inject(MAT_DIALOG_DATA) public ruleData: { rule: PropertyHouseRule }
  ) {
    console.log(ruleData);
    this.rule = this.ruleData.rule;

    this.cancelReason.setValue(this.rule.cancel_reason);


  }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.$dialogRef.close();
  }

  onSubmit(): void {
    this.rule.cancel_reason = this.cancelReason.value;
    this.rule.is_cancelled = true;
    this.$dialogRef.close(this.rule);
  }

}
