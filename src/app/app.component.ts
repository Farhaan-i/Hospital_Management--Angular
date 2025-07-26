import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hospital-management-frontend';
    currentUser: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  getDashboardRoute(): string {
    if (!this.currentUser || !this.currentUser.role) {
      return '/login'; // fallback if no user or role info
    }
    switch (this.currentUser.role.toLowerCase()) {
      case 'admin': return '/admin-dashboard';
      case 'staff': return '/staff-dashboard';
      case 'doctor': return '/doctor-dashboard';
      default: return '/login';
    }
  }

}
