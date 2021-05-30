import { Pipe, PipeTransform } from '@angular/core';
import { LangTranslateService } from 'src/app/services/lang-translate.service';

@Pipe({
  name: 'validateError',
})
export class ValidateErrorPipe implements PipeTransform {
  languageData: any = {};
  constructor(
    private $translate: LangTranslateService
  ) {
    this.languageData = this.$translate.data;
  }
  transform(errors: any | null, fieldName: string): any {
    if (errors) {
      if (errors.required) {
        return `${fieldName} ${this.languageData.validateErrorMessages.fieldRequired}`;
      }
      if (errors.email) {
        return `${fieldName} ${this.languageData.validateErrorMessages.notValid}`;
      }
      if (errors.minlength) {
        return `${fieldName} ${this.languageData.validateErrorMessages.minLength} ${errors.minlength.requiredLength} ${this.languageData.validateErrorMessages.charactersText}`;
      }
      if (errors.maxlength) {
        return `${fieldName} ${this.languageData.validateErrorMessages.minLength} ${errors.maxlength.requiredLength} ${this.languageData.validateErrorMessages.charactersText}`;
      }
      if (errors.min) {
        return `${fieldName} ${this.languageData.validateErrorMessages.min} ${errors.min.min}.`;
      }
      if (errors.max) {
        return `${fieldName} ${this.languageData.validateErrorMessages.max} ${errors.max.max}.`;
      }

      if (errors.misMatch) {
        return `${fieldName} ${this.languageData.validateErrorMessages.fieldMismatch}`;
      }
    }
    return null;
  }

}