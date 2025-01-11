import type { ShiftTemplate } from './shift.types';
import type { User } from './user.types';

export interface ScheduledShift {
  shiftTemplateId: string;
  scheduledCount: number;
  totalRequired: number;
  positionId: string;
  dayIndex: number;
  scheduledEmployees?: User[];
  unscheduledEmployees?: User[];
}

export type CalendarViewType = 'positions' | 'employees';

export interface EmployeeShift {
  shiftTemplate: ShiftTemplate;
  dayIndex: number;
}

export interface EmployeeSchedule {
  user: User;
  totalHours: number;
  shifts: EmployeeShift[];
}

export interface PositionSelectionBubble {
  userId: string;
  shiftTemplateId: string;
  dayIndex: number;
  position: { x: number; y: number };
}
