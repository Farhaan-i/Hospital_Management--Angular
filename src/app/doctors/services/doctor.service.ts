import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Doctor, CreateDoctorRequest } from '../../core/models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/Doctor/doctors`;

  constructor(private http: HttpClient) { }

  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  /**
   * IMPORTANT:
   * Set responseType to 'text' because backend returns plain text (not JSON)
   */
  addDoctor(doctor: CreateDoctorRequest): Observable<string> {
    return this.http.post(this.apiUrl, doctor, { responseType: 'text' });
  }

  updateDoctor(id: number, doctor: CreateDoctorRequest): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${id}`, doctor);
  }

  deleteDoctor(id: number): Observable<string> {
  return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
}
}
