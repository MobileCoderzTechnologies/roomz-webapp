import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageDragDirective } from './image-drag.directive';



@NgModule({
  declarations: [
    ImageDragDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageDragDirective
  ]
})
export class DragDropModule { }
