import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Slot } from '../../core/models/slot.model';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.scss']
})
export class DoctorDashboardComponent implements OnInit {
  currentUser: any;
  upcomingAppointments: any[] = [];
  todaysAppointments: any[] = [];
  slotMap: Map<number, Slot> = new Map();

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadTodaysAppointments();
  }
  fetchSlotById(slotId: number): void {
    // Prevent duplicate requests
    if (this.slotMap.has(slotId)) return;
  
    this.http.get<Slot>(`https://localhost:7199/api/Slot/${slotId}`)
      .subscribe({
        next: (slot) => this.slotMap.set(slotId, slot),
        error: (error) => console.error(`Error fetching slot ${slotId}:`, error)
      });
  }

  getTimeSlot(slotId: number): string {
    const slot = this.slotMap.get(slotId);
    if (!slot) return 'Fetching...';
    return `${slot.startTime} to ${slot.endTime}`;
  }
  getSlotDate(slotId: number): string {
    const slot = this.slotMap.get(slotId);
    return slot ? new Date(slot.slotDate).toLocaleDateString() : '—';
  }

  loadTodaysAppointments() {
    if (this.currentUser?.doctorId) {
      this.http.get<any[]>(`https://localhost:7199/api/Appointment/todays-appointments/${this.currentUser.doctorId}`)
        .subscribe({
          next: (appointments) => {
            this.todaysAppointments = appointments;
  
            appointments.forEach((appointment) => {
              if (appointment.slotId) {
                this.fetchSlotById(appointment.slotId);
              }
            });
          },
          error: (error) => console.error('Error loading appointments:', error)
        });
    }
  }
}