import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessToken } from 'src/app/modals/accces-token.modal';
import { User } from 'src/app/modals/user.modal';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private $http: HttpService
  ) { }

  login(data: any): Observable<LoginResp> {
    return this.$http.post('auth/login', data);
  }
}

interface LoginResp {
  message: string;
  data: {
    user: User;
    accessToken: AccessToken
  };
}
