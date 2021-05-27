import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LangTranslateService } from '../../../services/lang-translate.service';

@Pipe({
  name: 'langTranslate',
  pure: false
})
export class LangTranslatePipe implements PipeTransform {
  constructor(
    private $translate: LangTranslateService
  ) {
  }

  transform(key): string {
    if (this.$translate.data) {
      let translation;
      if (key.includes('.')) {
        const [first, second, third, fourth, fifth] = key.split('.');
        if (fifth) {
          translation = this.$translate.data[first][second][third][fourth][fifth];
        } else if (fourth) {
          translation = this.$translate.data[first][second][third][fourth];
        } else if (third) {
          translation = this.$translate.data[first][second][third];
        } else {
          translation = this.$translate.data[first][second];
        }
      } else {
        translation = this.$translate.data[key];
      }
      return translation;
    } else {
      return '';
    }
  }

}
