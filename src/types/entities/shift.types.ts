export interface ShiftTemplate {
  id: string;
  unitId: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface Shift {
  id: string;
  scheduleId: string;
  templateId: string;
  startTime: string;
  endTime: string;
  userId: string;
  positionId: string;
}

export interface ShiftRequirement {
  id: string;
  shiftTemplateId: string;
  positionId: string;
  requiredCount: number;
}
