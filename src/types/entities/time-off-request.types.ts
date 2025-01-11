import type { User } from './user.types'

export interface TimeOffRequest {
  id: string
  userId: string
  startDate: Date
  endDate: Date
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  resolvedAt?: Date
  user?: User
  approver?: User
}
