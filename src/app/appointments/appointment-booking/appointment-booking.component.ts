import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppointmentService } from '../services/appointment.service';
import { PatientService } from '../../patients/services/patient.service';
import { DoctorService } from '../../doctors/services/doctor.service';
import { SlotService } from '../services/slot.service';
import { Patient } from '../../core/models/patient.model';
import { Doctor } from '../../core/models/doctor.model';
import { Slot } from '../../core/models/slot.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-appointment-booking',
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.scss']
})
export class AppointmentBookingComponent implements OnInit {
  bookingForm: FormGroup;
  step: number = 1;
  maxStep: number = 4;
  minDate: Date = new Date();

  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  availableSlots: Slot[] = [];
  allDoctorSlots: Slot[] = [];
  loading: boolean = false;
  enabler = true;

  patientSearchControl: FormControl = new FormControl();
  doctorSearchControl: FormControl = new FormControl();

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private slotService: SlotService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    console.log('Component initialized');
    this.bookingForm = this.fb.group({
      patientId: [null, Validators.required],
      doctorId: [null, Validators.required],
      appointmentDate: [null, Validators.required],
      slotId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.loadPatients();
    this.loadDoctors();

    this.bookingForm.get('appointmentDate')?.valueChanges.subscribe(() => {
      console.log('Appointment date changed:', this.bookingForm.get('appointmentDate')?.value);
      if (this.step === 4) {
        console.log('Filtering slots on date change');
        this.filterSlotsByDate();
      }
    });
  }

  displayPatient(patient: Patient): string {
    console.log('Display patient:', patient);
    return patient ? `${patient.patientName} (ID: ${patient.patientId})` : '';
  }

  displayDoctor(doctor: Doctor): string {
    console.log('Display doctor:', doctor);
    return doctor ? `${doctor.doctorId} - Dr. ${doctor.doctorName} - ${doctor.specialization}` : '';
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    const formatted = `${displayHour}:${minutes} ${period}`;
    console.log('Formatted time:', formatted);
    return formatted;
  }

  loadPatients(): void {
    console.log('Loading patients...');
    this.patientService.getAllPatients().subscribe((patients: Patient[]) => {
      console.log('Patients loaded:', patients);
      this.patients = patients;
      this.filteredPatients = [...patients];
    });
  }

  loadDoctors(): void {
    console.log('Loading doctors...');
    this.doctorService.getAllDoctors().subscribe((doctors: Doctor[]) => {
      console.log('Doctors loaded:', doctors);
      this.doctors = doctors;
      this.filteredDoctors = [...doctors];
    });
  }

  fetchUnbookedSlots(doctorId: number): void {
    console.log('Fetching unbooked slots for doctor ID:', doctorId);
    this.loading = true;
    this.slotService.getUnbookedSlots(doctorId).subscribe({
      next: (slots: Slot[]) => {
        console.log('Unbooked slots:', slots);
        this.allDoctorSlots = slots;
        this.filterSlotsByDate();
        this.loading = false;
      },
      error: () => {
        console.error('Error fetching slots');
        this.snackBar.open('Error fetching unbooked slots', 'Close', { duration: 3000 });
        this.allDoctorSlots = [];
        this.loading = false;
      }
    });
  }

  filterSlotsByDate(): void {
    const selectedDate = this.bookingForm.get('appointmentDate')?.value;
    console.log('Filtering slots for date:', selectedDate);

    if (!selectedDate || !this.allDoctorSlots.length) {
      console.log('No date selected or no slots available');
      this.availableSlots = [];
      return;
    }

    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    console.log('Formatted selected date:', formattedDate);

    this.availableSlots = this.allDoctorSlots.filter(slot => {
      const slotDate = new Date(slot.slotDate).toISOString().split('T')[0];
      return slotDate === formattedDate;
    });

    console.log('Filtered available slots:', this.availableSlots);
  }

  previousStep(): void {
    console.log('Previous button clicked - Current step:', this.step);
    if (this.step > 1) {
      this.step--;
      console.log('Moved to previous step:', this.step);
    }
  }

  nextStep(): void {
    console.log('Next button clicked - Current step:', this.step);
    const valid = this.isStepValid();
    console.log('Step valid:', valid);
    if (this.step < this.maxStep && valid) {
      this.step++;
      this.enabler = true;
      console.log('Moved to next step:', this.step);
      if (this.step === 4) {
        console.log('Step 4 reached - filtering slots');
        this.filterSlotsByDate();
      }
    } else {
      console.warn('Cannot proceed to next step - form is invalid or max step reached');
    }
  }

  isStepValid(): boolean {
    const patientValid: boolean = this.bookingForm.get('patientId')?.valid ?? false;
    const doctorValid: boolean = this.bookingForm.get('doctorId')?.valid ?? false;
    const dateValid: boolean = this.bookingForm.get('appointmentDate')?.valid ?? false;
    const slotValid: boolean = this.bookingForm.get('slotId')?.valid ?? false;

    console.log('Validation status → Patient:', patientValid, 'Doctor:', doctorValid, 'Date:', dateValid, 'Slot:', slotValid);

    switch (this.step) {
      case 1: return patientValid;
      case 2: return doctorValid;
      case 3: return dateValid;
      case 4: return slotValid;
      default: return false;
    }
  }

  onPatientChange(event: MatAutocompleteSelectedEvent): void {
    const selectedPatient = event.option.value;
    console.log('Patient selected:', selectedPatient);
    this.bookingForm.get('patientId')?.setValue(selectedPatient.patientId);
    this.enabler = false;
    this.snackBar.open('Patient selected. You can now proceed to the next step.', 'Close', { duration: 3000 });
  }

  onDoctorChange(event: MatAutocompleteSelectedEvent): void {
    const selectedDoctor = event.option.value;
    console.log('Doctor selected:', selectedDoctor);
    this.bookingForm.get('doctorId')?.setValue(selectedDoctor.doctorId);
    this.fetchUnbookedSlots(selectedDoctor.doctorId);
    this.enabler = false;
    this.snackBar.open('Doctor selected. Please proceed to the next step.', 'Close', { duration: 3000 });
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate = event.value;
    if (selectedDate) {
      (this.bookingForm.get('appointmentDate') as FormControl).setValue(selectedDate);
      this.enabler = false;
      this.filterSlotsByDate();
      this.snackBar.open('Date selected. Proceed to the next step.', 'Close', { duration: 3000 });
    } else {
      console.warn('Invalid date selected');
    }
  }


  bookAppointment(): void {
    console.log('Confirm button clicked. Form valid?', this.bookingForm.valid);
    if (this.bookingForm.valid) {
      this.loading = true;
      const formValue = this.bookingForm.value;
      console.log("..............uuu...................");
      console.log(formValue);
      const request = {
        patientId: formValue.patientId,
        doctorId: formValue.doctorId,
        slotId: formValue.slotId,
        appointmentDate: new Date(formValue.appointmentDate),
        status: 'Booked' as const
      };
      console.log('1111111111111111111oooo11111111111111111111');
      console.log(request);

      

      this.appointmentService.bookAppointment(request).subscribe({
        next: () => {
          console.log('Appointment booked successfully!');
          this.snackBar.open('Appointment booked successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/appointments']);
        },
        error: () => {
          console.error('Booking failed');
          this.snackBar.open('Failed to book appointment', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      console.warn('Form is invalid — cannot book appointment');
    }
  }
}
