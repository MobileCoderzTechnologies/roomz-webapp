import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'otpTimer'
})
export class OtpTimerPipe implements PipeTransform {

  transform(value: number): string {
    if (value < 1) {
      return `00`;
    }
    let timer = `${value}`;
    if (value < 10) {
      timer = `0${value}`;
    }
    return timer;
  }

}
