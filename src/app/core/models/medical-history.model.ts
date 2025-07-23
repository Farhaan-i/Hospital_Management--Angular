export interface MedicalHistory {
  historyId: number;
  patientId: number;
  diagnosis: string;
  treatment: string;
  dateRecorded: Date;
}

export interface CreateMedicalHistoryRequest {
  historyId: number;
  patientId: number;
  diagnosis: string;
  treatment: string;
  dateRecorded: Date;
}