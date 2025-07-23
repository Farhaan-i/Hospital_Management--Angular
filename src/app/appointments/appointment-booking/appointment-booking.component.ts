import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../../patients/services/patient.service';
import { DoctorService } from '../../doctors/services/doctor.service';
import { AppointmentService } from '../services/appointment.service';
import { Patient } from '../../core/models/patient.model';
import { Doctor } from '../../core/models/doctor.model';
import { Slot, CreateAppointmentRequest } from '../../core/models/appointment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';
import { SlotService } from '../services/slot.service';

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

    // Check if we're editing an existing appointment
    const appointmentId = this.router.url.split('/').pop();
    if (appointmentId && !isNaN(+appointmentId)) {
      this.loading = true;
      this.appointmentService.getAppointmentById(+appointmentId).subscribe({
        next: (appointment) => {
          this.bookingForm.patchValue({
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            appointmentDate: new Date(appointment.appointmentDate)
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading appointment:', error);
          this.loading = false;
        }
      });
    }
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

  onDoctorChange(): void {
    this.bookingForm.get('appointmentDate')?.reset();
    this.bookingForm.get('slotId')?.reset();
  }


  nextStep(): void {
    if (this.step < this.maxStep) {
      this.step++;
      
      // If moving to step 3 (date selection) and doctor is selected, fetch slots
      if (this.step === 3 && this.bookingForm.get('doctorId')?.value) {
        this.onDateChange();
      }
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  isStepValid(): boolean {
    const form = this.bookingForm;
    switch (this.step) {
      case 1:
        return !!form.get('patientId')?.valid;
      case 2:
        return !!form.get('doctorId')?.valid;
      case 3:
        return !!form.get('appointmentDate')?.valid;
      case 4:
        return !!form.get('slotId')?.valid;
      default:
        return false;
    }
  }

  ngAfterViewInit() {
    // Auto-advance when step is completed
    this.bookingForm.valueChanges.subscribe(() => {
      if (this.isStepValid() && this.step < this.maxStep) {
        setTimeout(() => {
          this.nextStep();
        }, 300); // Small delay for better UX
      }
    });
  }

  onDateChange(): void {
    const doctorId = this.bookingForm.get('doctorId')?.value;
    const date = this.bookingForm.get('appointmentDate')?.value;
    
    if (doctorId && date) {
      this.loading = true;
      const formattedDate = date.toISOString().split('T')[0];
      this.slotService.getAvailableSlots(doctorId, formattedDate)
        .subscribe({
          next: (slots) => {
            this.availableSlots = slots;
            this.loading = false;
            if (slots.length > 0) {
              this.step = 4; // Auto-advance to slot selection
            }
          },
          error: (error) => {
            console.error('Error fetching slots:', error);
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
      const appointmentId = this.router.url.split('/').pop();
      
      const appointmentData: CreateAppointmentRequest = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Cancelled'
      };

      const operation = appointmentId && !isNaN(+appointmentId)
        ? this.appointmentService.updateAppointment(+appointmentId, appointmentData)
        : this.appointmentService.bookAppointment(appointmentData);

      operation.subscribe({
        next: () => {
          const message = appointmentId
            ? 'Appointment updated successfully'
            : 'Appointment booked successfully';
          this.snackBar.open(message, 'Close', { duration: 3000 });
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          console.error('Error saving appointment:', error);
          const message = appointmentId
            ? 'Error updating appointment'
            : 'Error booking appointment';
          this.snackBar.open(message, 'Close', { duration: 3000 });
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
