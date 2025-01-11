import type { AppAbility } from '@/services/abilities.service';
import type { Role } from './role.types';
import type { Position } from './position.types';
import type { AbilityRule } from './ability.types';

export interface UserPreferences {
  theme?: 'light' | 'dark';
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
  displaySettings?: {
    defaultView?: 'week' | 'month';
    timezone?: string;
  };
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
  positionId?: string;
  status: 'active' | 'inactive';
  preferences?: UserPreferences;
  rate?: number;
  weeklyHours?: number;
  availabilitySet?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  abilities?: AbilityRule[];
  avatar?: string;
  role?: Role | null;
  position?: Position | null;
}
