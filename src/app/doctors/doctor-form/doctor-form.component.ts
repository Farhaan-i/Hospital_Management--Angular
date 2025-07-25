import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DoctorService } from '../services/doctor.service';
import { Doctor, CreateDoctorRequest } from '../../core/models/doctor.model';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss']
})
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  isEditMode = false;
  loading = false;

  specializations = [
    'Cardiology', 'Dermatology', 'Emergency Medicine', 'Endocrinology',
    'Gastroenterology', 'Hematology', 'Infectious Disease', 'Nephrology',
    'Neurology', 'Oncology', 'Ophthalmology', 'Orthopedics', 'Otolaryngology',
    'Pediatrics', 'Psychiatry', 'Pulmonology', 'Radiology', 'Rheumatology', 'Urology'
  ];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DoctorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Doctor | null
  ) {
    this.isEditMode = !!data;

    this.doctorForm = this.fb.group({
      doctorName: [data?.doctorName || '', [Validators.required, Validators.minLength(2)]],
      specialization: [data?.specialization || '', Validators.required],
      doctorEmail: [data?.doctorEmail || '', [Validators.required, Validators.email]],
      doctorContactNumber: [data?.doctorContactNumber || '', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const formData: CreateDoctorRequest = this.doctorForm.value;

    if (this.isEditMode && this.data) {
      // Update doctor
      this.doctorService.updateDoctor(this.data.doctorId, formData).subscribe({
        next: () => {
          this.snackBar.open('Doctor updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating doctor:', error);
          this.snackBar.open('Error updating doctor', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      // Add new doctor - backend returns plain text message
      this.doctorService.addDoctor(formData).subscribe({
        next: (res: string) => {
          this.snackBar.open(res || 'Doctor added successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error adding doctor:', error);
          if (error.status === 400) {
            this.snackBar.open('Validation error: ' + (error.error?.message || ''), 'Close', { duration: 3000 });
          } else if (error.status === 409) {
            this.snackBar.open('Doctor already exists', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Failed to add doctor', 'Close', { duration: 3000 });
          }
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}


