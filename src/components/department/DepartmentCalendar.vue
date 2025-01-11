<!-- components/department/DepartmentCalendar.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-2">Department Calendar: Jul 21-27, 2024</h1>
      <div class="flex items-center text-sm text-gray-600">
        Scarborough General Hospital <ChevronRight class="h-4 w-4 mx-1" /> Internal Medicine
        <ChevronRight class="h-4 w-4 mx-1" />
        All Units
      </div>
    </div>

    <div class="flex gap-6">
      <CalendarSidebar @dragstart="handleDragStart" />

      <div class="flex-1 overflow-x-auto relative">
        <div class="bg-white rounded-lg border shadow min-w-[1024px]">
          <CalendarControls v-model="store.viewType" />

          <div class="grid grid-cols-8 divide-x divide-gray-200">
            <div class="p-4 font-medium min-w-[200px]">
              {{ isPositionView ? 'Positions' : 'Employees' }}
            </div>

            <div
              v-for="(day, index) in weekdays"
              :key="index"
              class="p-4 text-center min-w-[120px]"
            >
              <div class="font-medium">{{ day.day }}</div>
              <div class="text-sm text-gray-600">{{ day.date }}</div>
            </div>

            <template v-if="isPositionView">
              <CalendarRow
                v-for="position in store.positions"
                :key="position.id"
                :item="position"
                @dragover="handleDragOver"
                @dragleave="handleDragLeave"
                @drop="handleDrop"
              />
            </template>
            <template v-else>
              <CalendarRow
                v-for="user in store.users"
                :key="user.id"
                :item="user"
                @dragover="handleDragOver"
                @dragleave="handleDragLeave"
                @drop="handleDrop"
              />
            </template>
          </div>
        </div>
        <PositionSelectionBubble />
      </div>

      <ShiftRequirementsModal
        v-model="isModalOpen"
        :mode="modalMode"
        department-id="department-1"
        :dragged-data="store.draggedData"
        @save="handleSaveShift"
        @update:model-value="
          (value) => {
            isModalOpen = value
            if (!value) store.setDraggedData(null)
          }
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import type { ShiftTemplate, User } from '@/types'
import { useCalendarStore } from '@/stores/calendar.store'
import ShiftRequirementsModal from '@/components/shifts/ShiftRequirementsModal.vue'
import CalendarRow from '@/components/calendar/CalendarRow.vue'
import CalendarControls from '@/components/calendar/CalendarControls.vue'
import CalendarSidebar from '@/components/calendar/CalendarSidebar.vue'
import PositionSelectionBubble from '@/components/calendar/PositionSelectionBubble.vue'

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'update'>('create')
const store = useCalendarStore()

const weekdays = computed(() => {
  const startDate = new Date(2024, 6, 21)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    return {
      day: date.toLocaleString('en-US', { weekday: 'short' }),
      date: date.getDate(),
    }
  })
})

const isPositionView = computed(() => store.isPositionView)

function handleDragStart(e: DragEvent, shift: ShiftTemplate) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('shiftTemplateId', shift.id)
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  const target = e.currentTarget as HTMLElement
  target.classList.add('bg-gray-50')
}

function handleDragLeave(e: DragEvent) {
  const target = e.currentTarget as HTMLElement
  target.classList.remove('bg-gray-50')
}

function handleDrop(e: DragEvent, dayIndex: number, positionOrUserId?: string) {
  e.preventDefault()
  const target = e.currentTarget as HTMLElement
  target.classList.remove('bg-gray-50')

  if (!e.dataTransfer) return
  const shiftTemplateId = e.dataTransfer.getData('shiftTemplateId')
  const shiftTemplate = store.shiftTemplates.find((t) => t.id === shiftTemplateId)

  if (!shiftTemplate) return

  if (isPositionView.value) {
    modalMode.value = 'create'
    isModalOpen.value = true
    const position = store.positions.find((p) => p.id === positionOrUserId)

    store.setDraggedData({
      shiftTemplate,
      positionId: positionOrUserId!,
      dayIndex,
    })
    return
  }

  if (positionOrUserId) {
    const rect = target.getBoundingClientRect()
    store.setPositionSelectionBubble({
      userId: positionOrUserId,
      shiftTemplateId,
      dayIndex,
      position: {
        x: rect.right - 20,
        y: rect.top + 20,
      },
    })
  }
}

function handleSaveShift(
  scheduledCount: number,
  totalRequired: number,
  scheduledEmployees: User[],
) {
  if (store.draggedData) {
    const position = store.positions.find((p) => p.id === store.draggedData?.positionId)
    scheduledEmployees.forEach((employee) => {
      employee.position = position || null
    })

    store.addScheduledShift({
      shiftTemplateId: store.draggedData.shiftTemplate.id,
      scheduledCount,
      totalRequired,
      positionId: store.draggedData.positionId,
      dayIndex: store.draggedData.dayIndex,
      scheduledEmployees,
    })
    isModalOpen.value = false
    store.setDraggedData(null)
  }
}
</script>
