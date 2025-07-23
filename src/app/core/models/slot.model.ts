export interface Slot {
  slotId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  doctorId: number;
  patientId: number | null;
  appointmentId: number | null;
  doctor?: {
    doctorId: number;
    doctorName: string;
    specialization: string;
  };
  patient?: {
    patientId: number;
    patientName: string;
  };
}