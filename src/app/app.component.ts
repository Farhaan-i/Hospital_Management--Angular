import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentUser: AuthResponse | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  getDashboardRoute(): string {
    if (!this.currentUser || !this.currentUser.role) return '/login';
    switch (this.currentUser.role.toLowerCase()) {
      case 'admin': return '/admin-dashboard';
      case 'staff': return '/staff-dashboard';
      case 'doctor': return '/doctor-dashboard';
      default: return '/login';
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        // option to still clear and navigate anyway
        this.router.navigate(['/login']);
      }
    });
  }
}
