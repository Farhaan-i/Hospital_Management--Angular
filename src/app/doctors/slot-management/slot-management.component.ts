import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../../core/models/doctor.model';
import { SlotService } from '../../appointments/services/slot.service';
import { GenerateSlotsRequest } from '../../core/models/appointment.model';

@Component({
  selector: 'app-slot-management',
  templateUrl: './slot-management.component.html',
  styleUrls: ['./slot-management.component.scss']
})
export class SlotManagementComponent implements OnInit {
  slotForm: FormGroup;
  doctors: Doctor[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private slotService: SlotService,
    private snackBar: MatSnackBar
  ) {
    this.slotForm = this.fb.group({
      doctorId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      dailyStartTime: ['09:00', Validators.required],
      dailyEndTime: ['17:00', Validators.required],
      slotDuration: ['30', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    const loadTimeout = setTimeout(() => {
      this.loading = false;
      this.snackBar.open('Failed to load doctors - check connection', 'Close', {duration: 3000});
    }, 10000); // 10 second timeout

    this.doctorService.getAllDoctors().subscribe({
      next: (doctors) => {
        clearTimeout(loadTimeout);
        this.doctors = doctors;
        this.loading = false;
      },
      error: (error) => {
        clearTimeout(loadTimeout);
        console.error('Error loading doctors:', error);
        this.snackBar.open('Error loading doctors', 'Close', {duration: 3000});
        this.loading = false;
      }
    });
  }

  generateSlots(): void {
    if (this.slotForm.valid) {
      this.loading = true;
      const formData = this.slotForm.value;
      const request: GenerateSlotsRequest = {
        doctorId: formData.doctorId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        dailyStartTime: formData.dailyStartTime,
        dailyEndTime: formData.dailyEndTime,
        slotDuration: formData.slotDuration
      };

      this.slotService.generateSlots(request).subscribe({
        next: () => {
          this.snackBar.open('Slots generated successfully', 'Close', { duration: 3000 });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error generating slots:', error);
          this.snackBar.open('Error generating slots', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  deletePastSlots(): void {
    const doctorId = this.slotForm.get('doctorId')?.value;
    if (doctorId) {
      this.loading = true;
      this.slotService.deletePastSlots(doctorId).subscribe({
        next: () => {
          this.snackBar.open('Past slots deleted successfully', 'Close', { duration: 3000 });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting past slots:', error);
          this.snackBar.open('Error deleting past slots', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}
