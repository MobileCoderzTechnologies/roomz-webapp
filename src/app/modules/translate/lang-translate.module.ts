import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LangTranslatePipe } from './pipes/lang-translate.pipe';
import { LangTranslateService } from './services/lang-translate.service';




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
  providers: [
    LangTranslateService
  ]
})
export class LangTranslateModule { }
