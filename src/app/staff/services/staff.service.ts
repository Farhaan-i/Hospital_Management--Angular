import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Staff, CreateStaffRequest, UpdateStaffRequest } from '../../core/models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = `${environment.apiUrl}/Staff`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders()
    });
  }

  getStaffById(id: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  registerStaff(staff: CreateStaffRequest): Observable<Staff> {
    return this.http.post<Staff>(`${this.apiUrl}/register-staff`, staff, {
      headers: this.getAuthHeaders()
    });
  }

  updateStaff(id: number, staff: UpdateStaffRequest): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/update/${id}`, staff, {
      headers: this.getAuthHeaders()
    });
  }

  deleteStaff(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
