import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { backendUrl } from '../../../../environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith( backendUrl + '/api/')) {
      // Den Wert aus dem Local Storage abrufen (ersetze 'meinSchlüssel' durch den tatsächlichen Schlüssel)
      const token = localStorage.getItem('key');

      // Wenn ein Token im Local Storage vorhanden ist, füge es als Header 'Authorization' hinzu
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(authReq);
      }
    }

    return next.handle(req);
  }
}
