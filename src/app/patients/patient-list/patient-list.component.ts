import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PatientService } from '../services/patient.service';
import { Patient } from '../../core/models/patient.model';
import { MatDialog } from '@angular/material/dialog';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'patientId',
    'patientName',
    'patientEmail',
    'patientPhoneNumber',
    'gender',
    'actions'
  ];
  dataSource = new MatTableDataSource<Patient>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (patients) => {
        this.dataSource.data = patients;
        // Reset paginator to first page on reload
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.snackBar.open('Error loading patients', 'Close', { duration: 3000 });
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

  openPatientForm(patient?: Patient): void {
    const dialogRef = this.dialog.open(PatientFormComponent, {
      width: '600px',
      data: patient
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPatients();  // Reload patients after a successful add/update and dialog close
      }
    });
  }

  deletePatient(patient: Patient): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Patient',
        message: `Are you sure you want to delete ${patient.patientName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patientService.deletePatient(patient.patientId).subscribe({
          next: () => {
            this.snackBar.open('Patient deleted successfully', 'Close', { duration: 3000 });
            this.loadPatients();
          },
          error: (error) => {
            console.error('Error deleting patient:', error);
            this.snackBar.open('Error deleting patient', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  getGenderColor(gender: string | undefined): string {
    switch (gender?.toLowerCase()) {
      case 'male': return 'primary';
      case 'female': return 'accent';
      default: return '';
    }
  }
}
