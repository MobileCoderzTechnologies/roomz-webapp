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
      const translation = this.$translate.data[key];
      return translation;
    } else {
      return '';
    }
  }

}
