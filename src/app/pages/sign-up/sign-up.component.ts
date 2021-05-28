import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SignUpService } from './services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup = this.$signUpService.signUpForm();

  constructor(
    private $signUpService: SignUpService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log(this.signUpForm);
  }

}
