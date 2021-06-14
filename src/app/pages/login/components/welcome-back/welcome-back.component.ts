import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PASSWORD } from 'src/app/constants/regex.constant';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { LoginComponent } from '../../login.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-welcome-back',
  templateUrl: './welcome-back.component.html',
  styleUrls: ['./welcome-back.component.scss']
})
export class WelcomeBackComponent implements OnInit, OnChanges {

  @Input() checkEmailResponse: any;
  @Output() backToLogin = new EventEmitter();

  isSubmitting = false;

  passwordForm = new FormGroup({
    password: new FormControl(null,
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(19),
        Validators.pattern(PASSWORD)
      ]
    )
  });
  constructor(
    private $loginService: LoginService,
    private $alert: AlertService,
    private $dialogRef: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    console.log(this.checkEmailResponse);
  }

  onBack(): void {
    this.backToLogin.emit(true);
  }

  onSubmit(): void {
    const loginData = this.passwordForm.value;
    loginData.email = this.checkEmailResponse.email;
    this.login(loginData);
  }

  private login(loginData: any): void {
    this.isSubmitting = true;
    this.$loginService.login(loginData).subscribe(data => {
      const token = data.data.accessToken.token;
      localStorage.setItem('accessToken', token);
      const user = {
        name: `${data.data.user.first_name} ${data.data.user.last_name}`,
        profile: data.data.user.avatar
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.$alert.success(data.message);
      this.$loginService.isLoggedIn.next(true);
      this.isSubmitting = false;
      this.$dialogRef.close(null);
    }, err => {
      this.isSubmitting = false;
      this.$alert.danger(err.message);
    });
  }

}
