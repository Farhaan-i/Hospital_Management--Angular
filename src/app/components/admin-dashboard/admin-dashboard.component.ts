import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  slotId: number;
  appointmentDate: string;
  status: string; // e.g., 'Booked', 'Cancelled'
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  Object = Object; // For template usage of Object.keys

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

    // Load total doctors
    this.http.get<any[]>('https://localhost:7199/api/Doctor/doctors').subscribe({
      next: (doctors) => this.totalDoctors = doctors.length,
      error: (error) => console.error('Error fetching doctors count', error),
    });

    // Load total staff
    this.http.get<any[]>('https://localhost:7199/api/Staff/all').subscribe({
      next: (staff) => this.totalStaff = staff.length,
      error: (error) => console.error('Error fetching staff count', error),
    });

    // Load total patients
    this.http.get<any[]>('https://localhost:7199/api/Patient/patients').subscribe({
      next: (patients) => this.totalPatients = patients.length,
      error: (error) => console.error('Error fetching patients count', error),
    });

    // Load total appointments
    this.http.get<Appointment[]>('https://localhost:7199/api/Appointment/appointments').subscribe({
      next: (appointments) => this.totalAppointments = appointments.length,
      error: (error) => console.error('Error fetching appointments count', error),
      complete: () => this.loading = false
    });
  }

  private loadTodaysAppointments() {
    this.http.get<Appointment[]>('https://localhost:7199/api/Appointment/today').subscribe({
      next: (appointments) => {
        this.todayAppointments = appointments;
        this.bookedAppointments = appointments.filter(a => a.status === 'Booked').length;
        this.cancelledAppointments = appointments.filter(a => a.status === 'Cancelled').length;
      },
      error: (error) => console.error('Error loading today\'s appointments', error),
    });
  }

  private loadMonthlyAppointmentsData() {
    // Assume backend doesn't provide aggregation; aggregate client-side
    this.http.get<Appointment[]>('https://localhost:7199/api/Appointment/appointments').subscribe({
      next: (appointments) => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();

        const counts: { [key: string]: number } = {};

        appointments.forEach(appt => {
          const dt = new Date(appt.appointmentDate);
          if (dt.getMonth() === month && dt.getFullYear() === year) {
            const day = dt.getDate();
            counts[day] = (counts[day] || 0) + 1;
          }
        });

        this.appointmentsByDay = counts;
      },
      error: (error) => console.error('Error loading monthly appointments data', error),
    });
  }
}
