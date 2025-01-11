import type { PureAbility, MongoQuery } from '@casl/ability';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'crud';

export type Subjects =
  | 'Schedule'
  | 'Shift'
  | 'ShiftTemplate'
  | 'User'
  | 'Department'
  | 'Location'
  | 'TimeOffRequest'
  | 'Announcement'
  | 'ShiftExchange'
  | 'Timesheet'
  | 'Role'
  | 'Position'
  | 'Unit'
  | 'all';

export interface AbilityRule {
  action: Actions | Actions[]
  subject: Subjects | Subjects[]
  conditions?: MongoQuery
  fields?: string[]
  inverted?: boolean
}

export type AppAbility = PureAbility<[Actions, Subjects], MongoQuery>
