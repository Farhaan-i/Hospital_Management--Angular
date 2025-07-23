import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Slot, GenerateSlotsRequest } from '../../core/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  private apiUrl = `${environment.apiUrl}/Slot`;

  constructor(private http: HttpClient) { }

  generateSlots(request: GenerateSlotsRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/GenerateSlots`, request);
  }

  deletePastSlots(doctorId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-before-today/${doctorId}`);
  }

  getUnbookedSlots(doctorId: number): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.apiUrl}/UnbookedSlots/${doctorId}`);
  }

  getSlotById(id: number): Observable<Slot> {
    return this.http.get<Slot>(`${this.apiUrl}/${id}`);
  }

  updateSlot(slot: Slot): Observable<Slot> {
    return this.http.put<Slot>(`${this.apiUrl}/update`, slot);
  }

  getAvailableSlots(doctorId: number, date: string): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.apiUrl}/available?doctorId=${doctorId}&date=${date}`);
  }
}