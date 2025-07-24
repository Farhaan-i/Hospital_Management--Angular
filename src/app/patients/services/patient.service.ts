import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Patient, CreatePatientRequest } from '../../core/models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/Patient/patients`;

  constructor(private http: HttpClient) { }

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  createPatient(patient: CreatePatientRequest): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  // Use Patient instead of CreatePatientRequest here:
  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
