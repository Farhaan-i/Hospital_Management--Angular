import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  slotId: number;
  appointmentDate: string;
  status: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  Object = Object; // Enables Object.keys() in template

  currentUser: any;

  totalDoctors = 0;
  totalStaff = 0;
  totalPatients = 0;
  totalAppointments = 0;

  bookedAppointments = 0;
  cancelledAppointments = 0;

  todayAppointments: Appointment[] = [];
  appointmentsByDay: { [date: string]: number } = {};

  loading = true;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadCounts();
    this.loadTodaysAppointments();
    this.loadMonthlyAppointmentsData();
  }

  private loadCounts() {
    this.loading = true;
    this.http.get<any[]>('/api/Doctor/doctors').subscribe({
      next: (docs) => (this.totalDoctors = docs.length),
      error: (e) => console.error('Error fetching doctors count', e),
    });

    this.http.get<any[]>('/api/Staff/all').subscribe({
      next: (staff) => (this.totalStaff = staff.length),
      error: (e) => console.error('Error fetching staff count', e),
    });

    this.http.get<any[]>('/api/Patient/patients').subscribe({
      next: (patients) => (this.totalPatients = patients.length),
      error: (e) => console.error('Error fetching patients count', e),
    });

    this.http.get<Appointment[]>('/api/Appointment/appointments').subscribe({
      next: (appts) => {
        this.totalAppointments = appts.length;
        const now = new Date();
        const thisMonth = now.getMonth() + 1;
        const thisYear = now.getFullYear();
        // Could also tally monthly in this call if needed
      },
      error: (e) => console.error('Error fetching appointments', e),
      complete: () => (this.loading = false),
    });
  }

  private loadTodaysAppointments() {
    this.http.get<Appointment[]>('/api/Appointment/today').subscribe({
      next: (appts) => {
        this.todayAppointments = appts;
        this.bookedAppointments = appts.filter(a => a.status === 'Booked').length;
        this.cancelledAppointments = appts.filter(a => a.status === 'Cancelled').length;
      },
      error: (e) => console.error('Error fetching today appointments', e),
    });
  }

  private loadMonthlyAppointmentsData() {
    this.http.get<Appointment[]>('/api/Appointment/appointments').subscribe({
      next: (appts) => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        const counts: { [key: string]: number } = {};
        appts.forEach(appt => {
          const d = new Date(appt.appointmentDate);
          if (d.getMonth() === month && d.getFullYear() === year) {
            const day = d.getDate();
            counts[day] = (counts[day] || 0) + 1;
          }
        });
        this.appointmentsByDay = counts;
      },
      error: (e) => console.error('Error loading monthly appointments', e)
    });
  }
}
