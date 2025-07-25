import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {
  currentUser: any;
  upcomingAppointments: any[] = [];
  todaysAppointments: any[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTodaysAppointments();
  }

  loadTodaysAppointments() {
    if (this.currentUser?.doctorId) {
      this.http.get(`https://localhost:7199/api/Appointment/todays-appointments/${this.currentUser.doctorId}`)
        .subscribe({
          next: (data: any) => this.todaysAppointments = data,
          error: (error) => console.error('Error loading appointments:', error)
        });
    }
  }
}