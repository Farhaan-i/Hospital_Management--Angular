import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MedicalHistory, CreateMedicalHistoryRequest } from '../../core/models/medical-history.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private apiUrl = `${environment.apiUrl}/MedicalHistory/medical-histories`;

  constructor(private http: HttpClient) { }

  getAllMedicalHistories(): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(this.apiUrl);
  }

  getMedicalHistoryByPatient(patientId: number): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${this.apiUrl}/by-patient/${patientId}`);
  }

  addMedicalHistory(history: CreateMedicalHistoryRequest): Observable<MedicalHistory> {
    return this.http.post<MedicalHistory>(this.apiUrl, history);
  }

  updateMedicalHistory(id: number, history: CreateMedicalHistoryRequest): Observable<MedicalHistory> {
    return this.http.put<MedicalHistory>(`${this.apiUrl}/${id}`, history);
  }


  deleteMedicalHistory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMedicalHistoryByPhone(phoneNumber: string): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(`${this.apiUrl}/medical-history/${phoneNumber}`);
  }
}