// stores/calendar.store.ts
import { defineStore } from 'pinia'
import type { ShiftTemplate, ScheduledShift, User, Role, PositionSelectionBubble, Position } from '@/types'
import { MOCK_DATA } from '@/__mocks/mockData'

interface DragData {
  shiftTemplate: ShiftTemplate
  positionId: string
  dayIndex: number
}

export enum CalendarViewType {
  POSITIONS = 'positions',
  EMPLOYEES = 'employees',
}

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    viewType: CalendarViewType.POSITIONS,
    scheduledShifts: [] as ScheduledShift[],
    shiftTemplates: MOCK_DATA.shiftTemplates as ShiftTemplate[],
    roles: MOCK_DATA.roles as Role[],
    positions: MOCK_DATA.positions as Position[],
    users: MOCK_DATA.users as User[],
    draggedData: null as DragData | null,
    hasChanges: false,
    positionSelectionBubble: null as PositionSelectionBubble | null
  }),

  actions: {
    setViewType(type: CalendarViewType) {
      this.viewType = type
    },

    setPositionSelectionBubble(data: PositionSelectionBubble | null) {
      this.positionSelectionBubble = data
    },

    assignShiftToUser(positionId: string) {
      if (!this.positionSelectionBubble) return

      const { shiftTemplateId, dayIndex, userId } = this.positionSelectionBubble
      const user = this.users.find(u => u.id === userId)
      if (!user) return

      this.scheduledShifts.push({
        shiftTemplateId,
        scheduledCount: 1,
        totalRequired: 1,
        positionId,
        dayIndex,
        scheduledEmployees: [user]
      })
      this.positionSelectionBubble = null
    },

    addScheduledShift(shift: ScheduledShift) {
      this.scheduledShifts.push(shift)
      this.hasChanges = true
    },

    setDraggedData(data: DragData | null) {
      this.draggedData = data
    },

    markAsChanged() {
      this.hasChanges = true
    },

    publishChanges() {
      this.hasChanges = false
    }
  },

  getters: {
    isPositionView: (state) => {
      return state.viewType === CalendarViewType.POSITIONS
    },

    getScheduledShiftForDayAndPosition: (state) => {
      return (dayIndex: number, positionId: string) =>
        state.scheduledShifts.find(shift =>
          shift.dayIndex === dayIndex && shift.positionId === positionId
        )
    },

    getScheduledShiftForUser: (state) => {
      return (dayIndex: number, userId: string) =>
        state.scheduledShifts.find(shift =>
          shift.dayIndex === dayIndex &&
          shift.scheduledEmployees?.some(emp => emp.id === userId)
        )
    }
  }
})
