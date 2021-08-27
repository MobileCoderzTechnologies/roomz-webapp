import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { SignUpService } from '../../services/sign-up.service';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss']
})
export class AddPhotoComponent implements OnInit {

  @Input() dialogRef: any;
  isCongrats = false;

  isLoading = false;
  selectedImage: any;
  profilePhotoUrl = '';

  selectedProfilePhoto: any;

  constructor(
    private $signUpService: SignUpService,
    private $alert: AlertService
  ) { }

  ngOnInit(): void {
  }

  goCongratulations(): void {
    this.isCongrats = true;
  }

  selectProfilePhoto(event): void {
    const photo = event.target.files[0];

    if (photo) {
      this.selectedImage = photo;
      this.profilePhotoUrl = '';
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedProfilePhoto = reader.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  updateProfilePhoto(): void {
    this.isLoading = true;
    if (this.selectedImage) {
      const formData = new FormData();
      formData.set('photo', this.selectedImage);
      this.$signUpService.updateProfilePhoto(formData).subscribe(res => {
        this.isLoading = false;
        console.log(res);

      }, err => {
        this.isLoading = false;
        this.$alert.danger(err.message);
      });
    }

  }


}
