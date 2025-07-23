import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../../core/models/appointment.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { PatientService } from '../../patients/services/patient.service';
import { DoctorService } from '../../doctors/services/doctor.service';
import { Patient } from '../../core/models/patient.model';
import { Doctor } from '../../core/models/doctor.model';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  displayedColumns: string[] = [
    'appointmentId',
    'patientId',
    'doctorId',
    'appointmentDate',
    'status',
    'actions'
  ];
  dataSource = new MatTableDataSource<Appointment>();
  loading = false;
  patients: Patient[] = [];
  doctors: Doctor[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();
    this.loadDoctors();
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        this.dataSource.data = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
      }
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe(patients => {
      this.patients = patients;
    });
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe(doctors => {
      this.doctors = doctors;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.patientId === patientId);
    return patient ? patient.patientName : 'Unknown Patient';
  }

  getDoctorName(doctorId: number): string {
    const doctor = this.doctors.find(d => d.doctorId === doctorId);
    return doctor ? `Dr. ${doctor.doctorName}` : 'Unknown Doctor';
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'primary';
      case 'completed': return 'accent';
      case 'cancelled': return 'warn';
      default: return '';
    }
  }

  cancelAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Cancel Appointment',
        message: 'Are you sure you want to cancel this appointment?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.cancelAppointment(appointment.appointmentId)
          .subscribe(() => this.loadAppointments());
      }
    });
  }

  deleteAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Appointment',
        message: 'Are you sure you want to delete this appointment?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.deleteAppointment(appointment.appointmentId)
          .subscribe(() => this.loadAppointments());
      }
    });
  }
}