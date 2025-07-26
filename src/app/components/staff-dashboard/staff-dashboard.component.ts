import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

interface Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  slotId: number;
  appointmentDate: string;
  status: string;
}

interface Staff {
  staffId: number;
  staffName: string;
  staffRole: string;
  staffEmail: string;
  staffPhoneNumber: string;
}

@Component({
  selector: 'app-staff-dashboard',
  templateUrl: './staff-dashboard.component.html',
  styleUrls: ['./staff-dashboard.component.scss']
})
export class StaffDashboardComponent implements OnInit {
  currentStaff: Staff | null = null;

  totalDoctors = 0;
  totalPatients = 0;
  todaysAppointments: Appointment[] = [];

  bookedCount = 0;
  cancelledCount = 0;

  loading = true;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.staffId) {
      this.loadStaffDetails(user.staffId);
    }
    this.loadTotals();
    this.loadTodaysAppointments();
  }

  loadStaffDetails(staffId: number): void {
    this.http.get<Staff>(`https://localhost:7199/api/Staff/${staffId}`)
      .subscribe({
        next: staff => this.currentStaff = staff,
        error: err => console.error('Error loading staff details:', err)
      });
  }

  loadTotals(): void {
    this.http.get<any[]>('https://localhost:7199/api/Doctor/doctors')
      .subscribe({
        next: doctors => this.totalDoctors = doctors.length,
        error: err => console.error('Error loading doctors:', err)
      });

    this.http.get<any[]>('https://localhost:7199/api/Patient/patients')
      .subscribe({
        next: patients => this.totalPatients = patients.length,
        error: err => console.error('Error loading patients:', err)
      });
  }

  loadTodaysAppointments(): void {
    this.http.get<Appointment[]>('https://localhost:7199/api/Appointment/today')
      .subscribe({
        next: appointments => {
          this.todaysAppointments = appointments;
          this.bookedCount = appointments.filter(a => a.status === 'Booked').length;
          this.cancelledCount = appointments.filter(a => a.status === 'Cancelled').length;
          this.loading = false;
        },
        error: err => {
          console.error('Error loading today appointments:', err);
          this.loading = false;
        }
      });
  }
}