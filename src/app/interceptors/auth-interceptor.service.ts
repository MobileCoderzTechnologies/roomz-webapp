import { isPlatformBrowser } from '@angular/common';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let accessToken = null;
    if (isPlatformBrowser(this.platformId)) {
      accessToken = localStorage.getItem('accessToken');
    }

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
