import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../patients/services/patient.service';
import { DoctorService } from '../../doctors/services/doctor.service';
import { AppointmentService } from '../services/appointment.service';
import { SlotService } from '../services/slot.service';
import { Patient } from '../../core/models/patient.model';
import { Doctor } from '../../core/models/doctor.model';
import { Slot, CreateAppointmentRequest } from '../../core/models/appointment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.scss']
})
export class AppointmentBookingComponent implements OnInit {
  @ViewChild('picker') datePicker!: MatDatepicker<Date>;
  bookingForm: FormGroup;
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  availableSlots: Slot[] = [];
  loading = false;
  step = 1;
  maxStep = 4;
  minDate = new Date();

  isNextEnabled = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private slotService: SlotService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      slotId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
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

  onPatientSelected(): void {
    this.isNextEnabled = this.bookingForm.get('patientId')?.valid ?? false;
  }

  onDoctorSelected(): void {
    this.isNextEnabled = this.bookingForm.get('doctorId')?.valid ?? false;
  }

  onDateSelected(): void {
    this.isNextEnabled = this.bookingForm.get('appointmentDate')?.valid ?? false;
  }

  onSlotSelected(): void {
    this.isNextEnabled = this.bookingForm.get('slotId')?.valid ?? false;
  }

  onDoctorChange(): void {
    this.bookingForm.get('appointmentDate')?.reset();
    this.bookingForm.get('slotId')?.reset();
    this.isNextEnabled = false;
  }

  nextStep(): void {
    if (this.step < this.maxStep && this.isNextEnabled) {
      this.step++;
      this.isNextEnabled = false;
      if (this.step === 4) {
        this.onDateChange();
      }
    } else {
      this.snackBar.open('Please complete the current step before continuing', 'Close', { duration: 3000 });
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
      this.isNextEnabled = true;
    }
  }

  onDateChange(): void {
    const doctorId = this.bookingForm.get('doctorId')?.value;
    const date = this.bookingForm.get('appointmentDate')?.value;

    if (doctorId && date) {
      this.loading = true;
      const formattedDate = date.toISOString().split('T')[0];
      this.slotService.getAvailableSlots(doctorId, formattedDate).subscribe({
        next: (slots) => {
          this.availableSlots = slots;
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Error checking slot availability', 'Close', { duration: 3000 });
          this.availableSlots = [];
          this.loading = false;
        }
      });
    }
  }

  bookAppointment(): void {
    if (this.bookingForm.valid) {
      this.loading = true;
      const formData = this.bookingForm.value;

      const appointmentData: CreateAppointmentRequest = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        status: 'Scheduled'
      };

      this.appointmentService.bookAppointment(appointmentData).subscribe({
        next: () => {
          this.snackBar.open('Appointment booked successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/appointments']);
        },
        error: () => {
          this.snackBar.open('Error booking appointment', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  getSelectedPatient(): Patient | undefined {
    return this.patients.find(p => p.patientId === this.bookingForm.get('patientId')?.value);
  }

  getSelectedDoctor(): Doctor | undefined {
    return this.doctors.find(d => d.doctorId === this.bookingForm.get('doctorId')?.value);
  }
}
