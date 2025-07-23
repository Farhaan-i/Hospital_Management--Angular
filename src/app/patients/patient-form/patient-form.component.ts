import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PatientService } from '../services/patient.service';
import { Patient, CreatePatientRequest } from '../../core/models/patient.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  patientForm: FormGroup;
  isEditMode = false;
  loading = false;

  genders = ['Male', 'Female', 'Other'];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    public dialogRef: MatDialogRef<PatientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Patient
  ) {
    this.isEditMode = !!data;
    
    this.patientForm = this.fb.group({
      patientName: [data?.patientName || '', [Validators.required, Validators.minLength(2)]],
      patientEmail: [data?.patientEmail || '', [Validators.email]],
      patientPhoneNumber: [data?.patientPhoneNumber || '', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      gender: [data?.gender || ''],
      patientDateOfBirth: [data?.patientDateOfBirth || '']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.loading = true;
      const formData: CreatePatientRequest = {
        patientName: this.patientForm.value.patientName,
        patientEmail: this.patientForm.value.patientEmail,
        patientPhoneNumber: this.patientForm.value.patientPhoneNumber,
        gender: this.patientForm.value.gender,
        patientDateOfBirth: this.patientForm.value.patientDateOfBirth
      };

      if (this.isEditMode) {
        this.patientService.updatePatient(this.data.patientId, formData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating patient:', error);
            this.loading = false;
          }
        });
      } else {
        this.patientService.createPatient(formData).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error registering patient:', error);
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
