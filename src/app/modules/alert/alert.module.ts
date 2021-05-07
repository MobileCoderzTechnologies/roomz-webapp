import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from './alert.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  exports: [
    MatSnackBarModule
  ],
  providers: [
    AlertService
  ]
})
export class AlertModule { }
