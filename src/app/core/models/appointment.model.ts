export interface Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Booked';
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Booked';
  slotId: number;
}

export interface Slot {
  slotId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  doctorId: number;
  doctor: any | null;
  patientId: number | null;
  patient: any | null;
  appointmentId: number | null;
  appointments: any[];
}

export interface GenerateSlotsRequest {
  startDate: string;
  endDate: string;
  slotDuration: string;
  dailyStartTime: string;
  dailyEndTime: string;
  doctorId: number;
}