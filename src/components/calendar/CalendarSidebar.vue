<!-- components/calendar/CalendarSidebar.vue -->
<template>
  <div class="w-64">
    <div class="flex flex-col h-full gap-6">
      <Button class="w-full bg-blue-600 hover:bg-blue-700"> Publish & Notify </Button>

      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Shift Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea class="h-96">
            <div class="flex flex-col gap-3">
              <div
                v-for="shift in store.shiftTemplates"
                :key="shift.id"
                class="p-3 bg-blue-50 rounded-lg border border-blue-100 cursor-move"
                draggable="true"
                @dragstart="(e) => handleDragStart(e, shift)"
              >
                <div class="font-medium">{{ shift.name }}</div>
                <div class="text-sm text-gray-600">{{ shift.startTime }}-{{ shift.endTime }}</div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Button variant="outline" class="w-full">
        <Plus class="h-4 w-4 mr-2" />
        Add Custom Shift
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import type { ShiftTemplate } from '@/types'
import { useCalendarStore } from '@/stores/calendar.store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const store = useCalendarStore()

const emit = defineEmits<{
  dragstart: [e: DragEvent, shift: ShiftTemplate]
}>()

function handleDragStart(e: DragEvent, shift: ShiftTemplate) {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('shiftTemplateId', shift.id)
    emit('dragstart', e, shift)
  }
}
</script>
