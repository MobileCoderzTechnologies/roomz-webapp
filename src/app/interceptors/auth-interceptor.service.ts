import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const Authorization = `Bearer ${accessToken}`;
      req = req.clone(
        {
          setHeaders: { Authorization }
        }
      );
    }
    return next.handle(req);
  }
}
