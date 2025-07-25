import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = localStorage.getItem('accessToken');
              req = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(req);
            }),
            catchError(() => {
              this.authService.logout().subscribe();
              this.router.navigate(['/login']);
              return throwError(error);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}