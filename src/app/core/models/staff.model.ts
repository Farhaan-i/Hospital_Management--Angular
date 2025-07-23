export interface Staff {
  staffId: number;
  staffName: string;
  staffRole: string;
  staffEmail: string;
  staffPhoneNumber: string;
}

export interface CreateStaffRequest {
  staffName: string;
  staffRole: string;
  staffEmail: string;
  staffPhoneNumber: string;
}

export interface UpdateStaffRequest {
  staffId: number;
  staffName: string;
  staffRole: string;
  staffEmail: string;
  staffPhoneNumber: string;
}