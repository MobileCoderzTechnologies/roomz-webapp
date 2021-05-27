import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LangTranslatePipe } from './pipes/lang-translate.pipe';




@NgModule({
  declarations: [
    LangTranslatePipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    LangTranslatePipe
  ],
})
export class LangTranslateModule { }
