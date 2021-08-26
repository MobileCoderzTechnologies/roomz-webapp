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
        timeFormat = `12 AM`;
      }

      if (Math.floor(value) === 25) {
        timeFormat = `1 AM (Next Day)`;
      }

      if (Math.floor(value) === 26) {
        timeFormat = `2 AM (Next Day)`;
      }

      if (Math.floor(value) === 30) {
        timeFormat = 'Flexible';
      }
      if (Math.floor(value) === 31) {
        timeFormat = 'Before Check in time';
      }
    }
    else {
      const time = `${value}`.split('.').join(':');
      timeFormat = `${time} AM`;
    }
    return timeFormat;
  }

}
