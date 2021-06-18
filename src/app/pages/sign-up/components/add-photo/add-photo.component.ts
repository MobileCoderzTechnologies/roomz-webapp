import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SignUpService } from '../../services/sign-up.service';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss']
})
export class AddPhotoComponent implements OnInit {

  @Input() dialogRef: any;
  isCongrats = false;

  constructor(
    private $signUpService: SignUpService
  ) { }

  ngOnInit(): void {
  }

  goCongratulations(): void {
    this.isCongrats = true;
  }


}
