import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Directive({
  selector: '[appImageDrag]'
})
export class ImageDragDirective {

  // tslint:disable-next-line: no-output-rename
  @Output('files') files: EventEmitter<File[]> = new EventEmitter();
  @HostBinding('style.background') public background = '#fff';

  constructor(private $sanitizer: DomSanitizer) { }
  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#fff';
  }
  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#fff';
    const files = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      const file = evt.dataTransfer.files[i];
      // const url = this.$sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      files.push(file);
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }

}


interface FileHandle {
  file: File;
  url: SafeUrl;
}

