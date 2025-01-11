interface BaseTimeRange {
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface AvailabilityTemplate extends BaseTimeRange {
  id: string;
  name: string;
  shortName: string;
  isDefault?: boolean;
  isActive: boolean;
  departmentId: string;
}

export interface Availability extends BaseTimeRange {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  templateId?: string; // References AvailabilityTemplate
  recurrenceRule?: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  template?: AvailabilityTemplate;
}
