import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidateErrorPipe } from './pipes/validate-error.pipe';



@NgModule({
  declarations: [
    ValidateErrorPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ValidateErrorPipe
  ]
})
export class ValidateErrorModule { }
