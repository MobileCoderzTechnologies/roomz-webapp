import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from '../alert/alert.module';
import { DialogModule } from '../dialog/dialog.module';
import { LangTranslateModule } from '../translate/lang-translate.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AlertModule,
    DialogModule,
    LangTranslateModule
  ],
  exports: [
    CommonModule,
    AlertModule,
    DialogModule,
    LangTranslateModule
  ]
})
export class SharedModule { }
