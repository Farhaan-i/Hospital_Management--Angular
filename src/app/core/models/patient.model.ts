export interface Patient {
  patientId: number;
  patientName: string;
  patientEmail?: string;
  patientPhoneNumber: string;
  patientDateOfBirth?: Date;
  gender?: string;
  appointments?: any[];
  medicalHistories?: any[];
  bookedSlots?: any[];
}

export interface CreatePatientRequest {
  patientName: string;
  patientEmail?: string;
  patientPhoneNumber: string;
  patientDateOfBirth?: Date;
  gender?: string;
}