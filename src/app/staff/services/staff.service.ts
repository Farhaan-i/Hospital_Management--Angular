import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Staff, CreateStaffRequest, UpdateStaffRequest } from '../../core/models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = `${environment.apiUrl}/Staff`;

  constructor(private http: HttpClient) { }

  getAllStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}/all`);
  }

  getStaffById(id: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}/${id}`);
  }

  registerStaff(staff: CreateStaffRequest): Observable<Staff> {
    return this.http.post<Staff>(`${this.apiUrl}/register-staff`, staff);
  }

  updateStaff(id: number, staff: UpdateStaffRequest): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/update/${id}`, staff);
  }

  deleteStaff(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}