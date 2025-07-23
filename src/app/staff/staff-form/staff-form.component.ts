import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StaffService } from '../services/staff.service';
import { Staff, CreateStaffRequest, UpdateStaffRequest } from '../../core/models/staff.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-staff-form',
  templateUrl: './staff-form.component.html',
  styleUrls: ['./staff-form.component.scss']
})
export class StaffFormComponent implements OnInit {
  staffForm: FormGroup;
  isEditMode = false;
  loading = false;

  roles = [
    'Receptionist',
    'Nurse', 
    'Administrator',
    'Technician',
    'Pharmacist',
    'Therapist'
  ];

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<StaffFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Staff
  ) {
    this.isEditMode = !!data;
    
    this.staffForm = this.fb.group({
      staffName: [data?.staffName || '', [Validators.required, Validators.minLength(2)]],
      staffRole: [data?.staffRole || '', Validators.required],
      staffEmail: [data?.staffEmail || '', [Validators.required, Validators.email]],
      staffPhoneNumber: [data?.staffPhoneNumber || '', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.staffForm.valid) {
      this.loading = true;
      
      if (this.isEditMode) {
        const formData: UpdateStaffRequest = {
          staffId: this.data.staffId,
          ...this.staffForm.value
        };
        
        this.staffService.updateStaff(this.data.staffId, formData).subscribe({
          next: () => {
            this.snackBar.open('Staff updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating staff:', error);
            this.snackBar.open('Error updating staff', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      } else {
        const formData: CreateStaffRequest = this.staffForm.value;
        
        this.staffService.registerStaff(formData).subscribe({
          next: () => {
            this.snackBar.open('Staff added successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error adding staff:', error);
            this.snackBar.open('Error adding staff', 'Close', { duration: 3000 });
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