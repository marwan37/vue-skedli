<!-- components/calendar/CalendarCell.vue -->
<template>
  <div
    class="p-4 min-h-32 transition-colors duration-200 flex items-center justify-center"
    @dragover.prevent="$emit('dragover', $event)"
    @dragleave="$emit('dragleave', $event)"
    @drop.prevent="handleDrop($event)"
  >
    <CalendarShiftCard
      v-if="scheduledShift && shiftTemplate"
      :scheduled-count="scheduledShift.scheduledCount"
      :total-required="scheduledShift.totalRequired"
      :name="shiftTemplate.name"
      :start-time="shiftTemplate.startTime"
      :end-time="shiftTemplate.endTime"
    />
  </div>
</template>

<script setup lang="ts">
import type { ScheduledShift, ShiftTemplate } from '@/types'
import CalendarShiftCard from './CalendarShiftCard.vue'

interface Props {
  scheduledShift?: ScheduledShift
  shiftTemplate?: ShiftTemplate
  onDrop: (e: DragEvent) => void
}

defineProps<Props>()

const emit = defineEmits<{
  dragover: [e: DragEvent]
  dragleave: [e: DragEvent]
  drop: [e: DragEvent]
}>()

function handleDrop(e: DragEvent) {
  emit('drop', e)
}
</script>
