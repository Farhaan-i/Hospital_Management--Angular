import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { DoctorService } from '../services/doctor.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Doctor } from '../../core/models/doctor.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [
    // Angular modules
    NgIf,
    RouterLink,
    
    // Material modules
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss']
})
export class DoctorDetailsComponent implements OnInit {
  doctor: Doctor | undefined;
  loading = true;

  constructor(
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.doctorService.getDoctorById(id).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
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