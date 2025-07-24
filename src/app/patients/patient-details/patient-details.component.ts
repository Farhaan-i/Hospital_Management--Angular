import { Component, OnInit } from '@angular/core';
import { Patient } from '../../core/models/patient.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  patient: Patient | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.patientService.getPatientById(id).subscribe({
        next: (pat) => {
          this.patient = pat;
          this.loading = false;
        },
        error: (err) => {
          this.patient = undefined;
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  goBack(): void {
    this.location.back();
  }
}
