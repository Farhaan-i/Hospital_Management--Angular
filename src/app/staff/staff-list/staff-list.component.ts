import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StaffService } from '../services/staff.service';
import { Staff } from '../../core/models/staff.model';
import { MatDialog } from '@angular/material/dialog';
import { StaffFormComponent } from '../staff-form/staff-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  displayedColumns: string[] = [
    'staffId',
    'staffName', 
    'staffRole',
    'staffEmail',
    'staffPhoneNumber',
    'actions'
  ];
  dataSource = new MatTableDataSource<Staff>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private staffService: StaffService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadStaff(): void {
    this.loading = true;
    this.staffService.getAllStaff().subscribe({
      next: (staff) => {
        this.dataSource.data = staff;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading staff:', error);
        this.snackBar.open('Error loading staff', 'Close', { duration: 3000 });
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

  openStaffForm(staff?: Staff): void {
    const dialogRef = this.dialog.open(StaffFormComponent, {
      width: '600px',
      data: staff
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStaff();
      }
    });
  }

  deleteStaff(staff: Staff): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Staff',
        message: `Are you sure you want to delete ${staff.staffName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.staffService.deleteStaff(staff.staffId).subscribe({
          next: () => {
            this.snackBar.open('Staff deleted successfully', 'Close', { duration: 3000 });
            this.loadStaff();
          },
          error: (error) => {
            console.error('Error deleting staff:', error);
            this.snackBar.open('Error deleting staff', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}