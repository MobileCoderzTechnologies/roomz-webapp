import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule, MatToolbarRow} from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const modules = [
  MatToolbarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [
    ...modules
  ]
})
export class MaterialModule { }
