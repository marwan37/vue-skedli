<!-- components/calendar/CalendarShiftCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendar.store'

interface Props {
  scheduledCount: number
  totalRequired: number
  name: string
  startTime: string
  endTime: string
}

const props = defineProps<Props>()
const store = useCalendarStore()

const backgroundColor = computed(() => {
  if (props.scheduledCount === 0) return 'bg-gray-50'
  if (props.scheduledCount === props.totalRequired) return 'bg-blue-300'
  return 'bg-blue-100'
})
</script>

<template>
  <div :class="['text-sm p-3 rounded-md', backgroundColor]">
    <div v-if="store.viewType === 'positions'" class="font-medium text-center">
      {{ scheduledCount }}/{{ totalRequired }}
    </div>
    <div class="text-center">{{ name }}</div>
    <div class="text-gray-600 text-center">{{ startTime }}-{{ endTime }}</div>
  </div>
</template>
