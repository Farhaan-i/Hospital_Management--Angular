import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../../core/models/doctor.model';
import { MatDialog } from '@angular/material/dialog';
import { DoctorFormComponent } from '../doctor-form/doctor-form.component';
import { Router } from '@angular/router';
import { SlotService } from '../../appointments/services/slot.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SlotDialogComponent } from './slot-dialog/slot-dialog.component';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'doctorId',
    'doctorName',
    'specialization',
    'doctorEmail',
    'doctorContactNumber',
    'actions'
  ];
  dataSource = new MatTableDataSource<Doctor>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private doctorService: DoctorService,
    private slotService: SlotService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.dataSource.data = doctors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // 🔴 ESSENTIAL CHANGE: for Add, pass null; for Edit, pass doctor object
  openDoctorForm(doctor?: Doctor): void {
    let dialogRef;
    if (doctor) {
      // Edit mode
      dialogRef = this.dialog.open(DoctorFormComponent, {
        width: '500px',
        data: doctor
      });
    } else {
      // Add mode
      dialogRef = this.dialog.open(DoctorFormComponent, {
        width: '500px',
        data: null
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDoctors();
      }
    });
  }

  openSlotManagement(): void {
    this.router.navigate(['/doctors/1/slots']);
  }

  viewDoctorDetails(doctorId: number): void {
    this.router.navigate(['/doctors', doctorId]);
  }

  viewSlots(doctor: Doctor): void {
    this.loading = true;
    this.slotService.getUnbookedSlots(doctor.doctorId).subscribe({
      next: (slots) => {
        this.dialog.open(SlotDialogComponent, {
          width: '500px',
          data: { slots, doctorName: doctor.doctorName }
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching unbooked slots:', error);
        this.snackBar.open('Error fetching unbooked slots', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
