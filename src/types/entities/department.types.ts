export interface Facility {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface Department {
  id: string;
  facilityId: string;
  name: string; // (e.g., "Surgery", "Internal Medicine", "Pediatrics")
  description?: string;
  headOfDepartment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Unit {
  id: string;
  departmentId: string;
  name: string; // (e.g., "Cardiac ICU", "General Wards")
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
