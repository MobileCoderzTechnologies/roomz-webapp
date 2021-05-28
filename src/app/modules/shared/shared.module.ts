import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from '../alert/alert.module';
import { DialogModule } from '../dialog/dialog.module';
import { LangTranslateModule } from '../translate/lang-translate.module';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AlertModule,
    DialogModule,
    LangTranslateModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    AlertModule,
    DialogModule,
    LangTranslateModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SharedModule { }
