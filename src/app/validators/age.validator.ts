import { FormGroup } from '@angular/forms';

export function ageValidator(controlName: string): any {
  return (formGroup: FormGroup) => {
    const tDate = Date.now();
    const control = formGroup.controls[controlName];
    if (control.value) {
      const inputDate = new Date(control.value);
      const userDateTime = inputDate.getTime();
      let ageDiff = tDate - userDateTime;
      ageDiff = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365));
      console.log(ageDiff);
      const ageDiffShouldBe = 18;
      const minDob = new Date(tDate - 18 * 1000 * 24 * 60 * 60 * 365);
      if (ageDiff > ageDiffShouldBe) {
        control.setErrors(null);
      } else {
        const errorObj = {
          age: true,
          minDob
        };
        console.log(errorObj);
        control.setErrors(errorObj);
      }
    }
  };
}
