import type { User } from './user.types'

export type NotificationType = 'assignment' | 'reminder' | 'approval' | 'update'

export type RelatedEntityType = 'shift' | 'timeoff' | 'schedule'

export interface Notification {
  id: string
  userId: string
  relatedEntityType: RelatedEntityType
  relatedEntityId: string
  notificationType: NotificationType
  content: {
    title: string
    message: string
    data?: Record<string, unknown>
  }
  isRead: boolean
  readAt?: Date
  user?: User
}
