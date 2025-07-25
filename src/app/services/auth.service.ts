import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  doctorId?: number;
  staffId?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  role: string;
  doctorId?: number;
  staffId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7199/api';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('currentUser', JSON.stringify(response));
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.currentUserSubject.next(response);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData);
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.API_URL}/auth/logout`, { refreshToken })
      .pipe(
        tap(() => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          this.currentUserSubject.next(null);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem('currentUser', JSON.stringify(response));
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.currentUserSubject.next(response);
        })
      );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}