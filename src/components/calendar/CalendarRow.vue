<!-- components/calendar/CalendarRow.vue -->
<template>
  <div class="col-span-8 grid grid-cols-8 divide-x divide-gray-200 border-t">
    <div class="p-4">
      <template v-if="isPositionView">
        <div class="font-medium">{{ (item as Position).name }}</div>
        <div class="text-sm text-gray-500">{{ positionHours }}h</div>
      </template>
      <template v-else>
        <div class="font-medium">{{ (item as User).fullName }}</div>
        <div class="text-sm text-gray-500">{{ userHours }}h</div>
      </template>
    </div>

    <CalendarCell
      v-for="index in 7"
      :key="index"
      :scheduled-shift="findScheduledShift(index - 1)"
      :shift-template="findShiftTemplate(index - 1)"
      @dragover="emit('dragover', $event)"
      @dragleave="emit('dragleave', $event)"
      @drop="handleDrop($event, index - 1)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Position, User } from '@/types'
import { useCalendarStore } from '@/stores/calendar.store'
import CalendarCell from './CalendarCell.vue'

interface Props {
  item: Position | User
}

const props = defineProps<Props>()
const store = useCalendarStore()

const isPositionView = computed(() => store.isPositionView)

const emit = defineEmits<{
  dragover: [e: DragEvent]
  dragleave: [e: DragEvent]
  drop: [e: DragEvent, dayIndex: number, userId?: string]
}>()

const handleDrop = (e: DragEvent, dayIndex: number) => {
  emit('drop', e, dayIndex, store.viewType === 'employees' ? (props.item as User).id : undefined)
}

const calculateShiftHours = (startTime: string, endTime: string): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  const start = startHour * 60 + startMinute
  let end = endHour * 60 + endMinute

  // If end time is earlier than start time, add 24 hours (overnight shift)
  if (end < start) {
    end += 24 * 60
  }

  return (end - start) / 60
}

const userHours = computed(() => {
  if (!isPositionView.value) {
    return store.scheduledShifts
      .filter((shift) =>
        shift.scheduledEmployees?.some((emp) => emp.id === (props.item as User).id),
      )
      .reduce((acc, curr) => {
        const template = store.shiftTemplates.find((t) => t.id === curr.shiftTemplateId)
        if (!template) return acc
        return acc + calculateShiftHours(template.startTime, template.endTime) * curr.scheduledCount
      }, 0)
  }
  return 0
})

const positionHours = computed(() => {
  if (isPositionView.value) {
    return store.scheduledShifts
      .filter((shift) => shift.positionId === (props.item as Position).id)
      .reduce((acc, curr) => {
        const template = store.shiftTemplates.find((t) => t.id === curr.shiftTemplateId)
        if (!template) return acc
        return acc + calculateShiftHours(template.startTime, template.endTime) * curr.scheduledCount
      }, 0)
  }
  return 0
})

const findScheduledShift = (dayIndex: number) => {
  const isPositionView = store.isPositionView
  const position = isPositionView ? (props.item as Position) : undefined
  const user = !isPositionView ? (props.item as User) : undefined

  return store.scheduledShifts.find((shift) => {
    if (shift.dayIndex !== dayIndex) return false

    if (isPositionView) {
      return shift.positionId === position?.id
    } else {
      return shift.scheduledEmployees?.some((emp) => emp.id === user?.id)
    }
  })
}

const findShiftTemplate = (dayIndex: number) => {
  const shift = findScheduledShift(dayIndex)
  return shift ? store.shiftTemplates.find((t) => t.id === shift.shiftTemplateId) : undefined
}
</script>
