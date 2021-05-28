import { FormGroup } from '@angular/forms';

export function matchPasswords(controlName: string, matchingControlName: string): any {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ misMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
