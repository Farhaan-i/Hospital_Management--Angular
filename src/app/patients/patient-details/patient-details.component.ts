import { Component, Input } from '@angular/core';
import { Patient } from '../../core/models/patient.model';
import { CommonModule } from '@angular/common';
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
export class PatientDetailsComponent {
  @Input() patient: Patient | undefined;
  loading = false;

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
