export interface Doctor {
  doctorId: number;
  doctorName: string;
  specialization: string;
  doctorEmail: string;
  doctorContactNumber: string;
}

export interface CreateDoctorRequest {
  doctorName: string;
  specialization: string;
  doctorEmail: string;
  doctorContactNumber: string;
}