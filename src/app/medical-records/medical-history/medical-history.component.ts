import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedicalHistoryService } from '../services/medical-history.service';
import { PatientService } from '../../patients/services/patient.service';
import { MedicalHistory, CreateMedicalHistoryRequest } from '../../core/models/medical-history.model';
import { Patient } from '../../core/models/patient.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.scss']
})
export class MedicalHistoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'historyId',
    'patientId',
    'diagnosis',
    'treatment',
    'dateRecorded',
    'actions'
  ];
  dataSource = new MatTableDataSource<MedicalHistory>();
  loading = false;
  showAddForm = false;

  medicalHistoryForm: FormGroup;
  patients: Patient[] = [];
  selectedPatientId: number | null = null;

  isEditMode = false;
  currentEditHistoryId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private medicalHistoryService: MedicalHistoryService,
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.medicalHistoryForm = this.fb.group({
      patientId: ['', Validators.required],
      diagnosis: ['', [Validators.required, Validators.minLength(3)]],
      treatment: ['', [Validators.required, Validators.minLength(3)]],
      dateRecorded: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMedicalHistories();
    this.loadPatients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadMedicalHistories(): void {
    this.loading = true;
    this.medicalHistoryService.getAllMedicalHistories().subscribe({
      next: (histories) => {
        this.dataSource.data = histories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading medical histories:', error);
        this.snackBar.open('Error loading medical histories', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
      }
    });
  }

  loadPatientHistory(patientId: number): void {
    this.loading = true;
    this.selectedPatientId = patientId;

    this.medicalHistoryService.getMedicalHistoryByPatient(patientId).subscribe({
      next: (histories) => {
        this.dataSource.data = histories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patient history:', error);
        this.snackBar.open('Error loading patient history', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleAddForm(history?: MedicalHistory): void {
    this.showAddForm = !this.showAddForm;

    if (this.showAddForm && history) {
      // Enter edit mode
      this.isEditMode = true;
      this.currentEditHistoryId = history.historyId;
      this.medicalHistoryForm.patchValue({
        patientId: history.patientId,
        diagnosis: history.diagnosis,
        treatment: history.treatment,
        dateRecorded: new Date(history.dateRecorded)
      });
    } else if (this.showAddForm && !history) {
      // Enter add mode
      this.isEditMode = false;
      this.currentEditHistoryId = null;
      this.medicalHistoryForm.reset();
      this.medicalHistoryForm.patchValue({ dateRecorded: new Date() });
    } else if (!this.showAddForm) {
      // Reset when form is closed
      this.isEditMode = false;
      this.currentEditHistoryId = null;
      this.medicalHistoryForm.reset();
      this.medicalHistoryForm.patchValue({ dateRecorded: new Date() });
    }
  }

  editMedicalHistory(history: MedicalHistory): void {
    if (!this.showAddForm) {
      this.toggleAddForm(history);
    } else {
      this.isEditMode = true;
      this.currentEditHistoryId = history.historyId;
      this.medicalHistoryForm.patchValue({
        patientId: history.patientId,
        diagnosis: history.diagnosis,
        treatment: history.treatment,
        dateRecorded: new Date(history.dateRecorded)
      });
    }
  }

  onSubmitMedicalHistory(): void {
    if (this.medicalHistoryForm.invalid) {
      this.medicalHistoryForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formValue = this.medicalHistoryForm.value;
    const payload: CreateMedicalHistoryRequest = {
      historyId: this.isEditMode && this.currentEditHistoryId ? this.currentEditHistoryId : 0,
      ...formValue,
    };

    if (this.isEditMode && this.currentEditHistoryId) {
      // Update
      this.medicalHistoryService.updateMedicalHistory(this.currentEditHistoryId, payload).subscribe({
        next: () => {
          this.snackBar.open('Medical history updated successfully', 'Close', { duration: 3000 });
          this.toggleAddForm();
          this.loadMedicalHistories();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating medical history:', error);
          this.snackBar.open('Failed to update medical history', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      // Add
      this.medicalHistoryService.addMedicalHistory(payload).subscribe({
        next: () => {
          this.snackBar.open('Medical history added successfully', 'Close', { duration: 3000 });
          this.toggleAddForm();
          this.loadMedicalHistories();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error adding medical history:', error);
          if (error.status === 400) {
            this.snackBar.open('Validation error: ' + error.error, 'Close', { duration: 3000 });
          } else if (error.status === 409) {
            this.snackBar.open('Medical history already exists', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Failed to add medical history', 'Close', { duration: 3000 });
          }
          this.loading = false;
        }
      });
    }
  }

  deleteMedicalHistory(history: MedicalHistory): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Medical History',
        message: 'Are you sure you want to delete this medical history record?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.medicalHistoryService.deleteMedicalHistory(history.historyId).subscribe({
          next: () => {
            this.snackBar.open('Medical history deleted successfully', 'Close', { duration: 3000 });
            this.loadMedicalHistories();
          },
          error: (error) => {
            console.error('Error deleting medical history:', error);
            this.snackBar.open('Error deleting medical history', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  clearFilter(): void {
    this.selectedPatientId = null;
    this.loadMedicalHistories();
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.patientId === patientId);
    return patient ? patient.patientName : 'Unknown Patient';
  }
}
