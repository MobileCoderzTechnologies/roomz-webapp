import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../login/services/login.service';
import { SignUpService } from './services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup = this.$signUpService.signUpForm();
  isSubmitting = false;

  loginType = 'EMAIL';

  constructor(
    private $dialog: MatDialog,
    private $signUpService: SignUpService,
    private $loginService: LoginService,
    private $dialogRef: MatDialogRef<SignUpComponent>,
    private $alert: AlertService,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    if (data.email) {
      this.loginType = data.loginType;
      this.signUpForm.controls.email.setValue(data.email);
    }
  }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.$dialogRef.close(null);
  }


  onSubmit(): void {
    this.isSubmitting = true;
    const userData = this.signUpForm.value;
    const [yyyy, mm, dd] = userData.dob.split('-');
    userData.dob = `${dd}-${mm}-${yyyy}`;
    userData.login_type = this.loginType;
    this.$signUpService.register(userData).subscribe(data => {
      const token = data.data.accessToken.token;
      localStorage.setItem('accessToken', token);
      this.$loginService.isLoggedIn.next(true);
      this.isSubmitting = false;
      this.$alert.success(data.message);
      this.closeDialog();
    }, err => {
      this.isSubmitting = false;
      this.$alert.danger(err.message);
    });
  }


  onLogin(): void {
    this.$dialogRef.close('login');
  }

}
