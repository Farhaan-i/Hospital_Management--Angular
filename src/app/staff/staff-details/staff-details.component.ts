import { Component, OnInit } from '@angular/core';
import { StaffService } from '../services/staff.service';
import { ActivatedRoute } from '@angular/router';
import { Staff } from '../../core/models/staff.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-staff-details',
  templateUrl: './staff-details.component.html',
  styleUrls: ['./staff-details.component.scss']
})
export class StaffDetailsComponent implements OnInit {
  staff: Staff | undefined;
  loading = true;

  constructor(
    private staffService: StaffService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.staffService.getStaffById(id).subscribe({
      next: (staff) => {
        this.staff = staff;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}