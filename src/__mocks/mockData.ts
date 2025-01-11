import type { Position, Role, User } from '@/types';

// mockData.ts
export const MOCK_DATA = {
  locations: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Chicago', 'New York'],
  departments: ['Emergency', 'Internal Medicine', 'Surgery', 'Radiology', 'Social Work Services'],
  shiftTemplates: [
    {
      id: 'shift-template-1',
      departmentId: 'department-1',
      unitId: 'unit-1',
      name: 'Morning',
      startTime: '07:00',
      endTime: '15:00',
    },
    {
      id: 'shift-template-2',
      departmentId: 'department-1',
      unitId: 'unit-1',
      name: 'Afternoon 1',
      startTime: '12:00',
      endTime: '20:00',
    },
    {
      id: 'shift-template-3',
      departmentId: 'department-1',
      unitId: 'unit-1',
      name: 'Night',
      startTime: '20:00',
      endTime: '07:00',
    },
  ],
  roles: [
    {
      id: 'employee',
      name: 'Employee',
      permissions: {
        read: true,
        update: true,
      },
    },
    {
      id: 'admin',
      name: 'Admin',
      permissions: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    },
  ],
  positions: [
    {
      id: 'er-physician',
      roleId: 'employee',
      name: 'ER Physician',
      description: 'Emergency Room Physician',
      color: 'bg-orange-500',
    },
    {
      id: 'registered-nurse',
      roleId: 'employee',
      name: 'Registered Nurse',
      description: 'RN',
      color: 'bg-blue-500',
    },
    {
      id: 'radiology-tech',
      roleId: 'employee',
      name: 'Radiology Tech',
      description: 'Radiology Technician',
      color: 'bg-purple-500',
    },
    {
      id: 'social-worker',
      roleId: 'employee',
      name: 'Social Worker',
      description: 'Social Worker',
      color: 'bg-pink-500',
    },
    {
      id: 'emt',
      roleId: 'employee',
      name: 'EMT',
      description: 'Emergency Medical Technician',
      color: 'bg-red-500',
    },
    {
      id: 'pharmacy',
      roleId: 'employee',
      name: 'Pharmacy',
      description: 'Pharmacy',
      color: 'bg-green-500',
    },
    {
      id: 'nurse-practitioner',
      roleId: 'employee',
      name: 'Nurse Practitioner',
      description: 'Nurse Practitioner',
      color: 'bg-slate-500',
    },
  ] as Position[],
  users: [
    {
      id: 'user-1',
      email: 'john@hospital.com',
      fullName: 'John Doe',
      status: 'active',
      preferences: {},
      roleId: 'employee',
      positionId: 'er-physician',
      rate: 75,
      weeklyHours: 36,
      availabilitySet: false,
    },
    {
      id: 'user-2',
      email: 'jane@hospital.com',
      fullName: 'Jane Smith',
      status: 'active',
      preferences: {},
      roleId: 'employee',
      positionId: 'registered-nurse',
      rate: 50,
      weeklyHours: 40,
      availabilitySet: true,
    },
  ] as User[],
  scheduledEmployees: [] as User[],
  unscheduledEmployees: [] as User[],
};

MOCK_DATA.users[0].role = MOCK_DATA.roles[0];
MOCK_DATA.users[0].position = MOCK_DATA.positions[1];
MOCK_DATA.users[1].role = MOCK_DATA.roles[1];
MOCK_DATA.users[1].position = MOCK_DATA.positions[2];
MOCK_DATA.scheduledEmployees = [MOCK_DATA.users[0]];
MOCK_DATA.unscheduledEmployees = [MOCK_DATA.users[1]];
