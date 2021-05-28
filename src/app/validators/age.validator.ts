import { AbstractControl } from '@angular/forms';

export function ageValidator(control: AbstractControl): void {
  const tDate = Date.now();
  if (control.value) {
    const inputDate = new Date(control.value);
    const userDateTime = inputDate.getTime();
    let ageDiff = tDate - userDateTime;
    ageDiff = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365));
    console.log(ageDiff);
    const ageDiffShouldBe = 13;
    if (ageDiff > ageDiffShouldBe) {
      control.setErrors(null);
    } else {
      control.setErrors({ age: true });
    }
  }
}
