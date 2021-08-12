import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    let timeFormat;
    if (value > 11.59) {
      const time = `${value - 12}`.split('.').join(':');
      timeFormat = `${time} PM`;
      if (Math.floor(value) === 12) {
        timeFormat = `12 PM`;
      }
      if (Math.floor(value) === 24) {
        timeFormat = `00 AM`;
      }
    }
    else {
      const time = `${value}`.split('.').join(':');
      timeFormat = `${time} AM`;
    }
    return timeFormat;
  }

}
