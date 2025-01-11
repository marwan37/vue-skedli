<!-- components/calendar/PositionSelectionBubble.vue -->
<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useCalendarStore } from '@/stores/calendar.store'

const store = useCalendarStore()

function handlePositionSelect(positionId: string) {
  const position = store.positions.find((p) => p.id === positionId)
  if (position) {
    store.assignShiftToUser(position.id)
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="store.positionSelectionBubble"
      class="fixed z-50 bg-white rounded-lg shadow-lg border p-2 w-48"
      :style="{
        top: `${store.positionSelectionBubble.position.y}px`,
        left: `${store.positionSelectionBubble.position.x}px`,
      }"
    >
      <Select @update:model-value="handlePositionSelect" autofocus>
        <SelectTrigger>
          <SelectValue placeholder="Select Position..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="position in store.positions" :key="position.id" :value="position.id">
            {{ position.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        class="absolute -top-2 -right-2 h-6 w-6"
        @click="store.setPositionSelectionBubble(null)"
      >
        ×
      </Button>
    </div>
  </Teleport>
</template>
