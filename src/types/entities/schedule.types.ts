export type ScheduleStatus = 'draft' | 'published' | 'archived';

export interface Schedule {
  id: string;
  hospitalId: string;
  departmentId: string;
  unitId: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: ScheduleStatus;
  publishedAt?: Date;
}
