import { Component, Inject, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { Patient, CreatePatientRequest } from '../../core/models/patient.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
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
    @Inject(MAT_DIALOG_DATA) public data: Patient,
    private ngZone: NgZone
  ) {
    this.isEditMode = !!data;

    this.patientForm = this.fb.group({
      patientName: [data?.patientName || '', [Validators.required, Validators.minLength(2)]],
      patientEmail: [data?.patientEmail || '', [Validators.required, Validators.email]],
      patientPhoneNumber: [data?.patientPhoneNumber || '', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      gender: [data?.gender || 'Male'],
      patientDateOfBirth: [data?.patientDateOfBirth || '']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.loading = true;

      if (this.isEditMode) {
        const updatedPatient: Patient = {
          ...this.data,
          patientName: this.patientForm.value.patientName,
          patientEmail: this.patientForm.value.patientEmail,
          patientPhoneNumber: this.patientForm.value.patientPhoneNumber,
          gender: this.patientForm.value.gender,
          patientDateOfBirth: this.patientForm.value.patientDateOfBirth
        };

        this.patientService.updatePatient(this.data.patientId, updatedPatient).subscribe({
          next: () => {
            // Ensure change detection triggers dialog close
            this.ngZone.run(() => this.dialogRef.close(true));
          },
          error: (error) => {
            console.error('Error updating patient:', error);
            this.loading = false;
          }
        });
      } else {
        const formData: CreatePatientRequest = {
          patientName: this.patientForm.value.patientName,
          patientEmail: this.patientForm.value.patientEmail,
          patientPhoneNumber: this.patientForm.value.patientPhoneNumber,
          gender: this.patientForm.value.gender,
          patientDateOfBirth: this.patientForm.value.patientDateOfBirth
        };

        this.patientService.createPatient(formData).subscribe({
          next: () => {
            this.ngZone.run(() => this.dialogRef.close(true));
          },
          error: (error) => {
            console.error('Error creating patient:', error);
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
