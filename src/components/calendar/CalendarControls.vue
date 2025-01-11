<!-- components/calendar/CalendarControls.vue -->
<template>
  <div class="flex items-center gap-4 mb-4 bg-white p-4 rounded-lg border">
    <ToggleGroup
      :model-value="modelValue"
      type="single"
      @update:model-value="emit('update:modelValue', $event)"
      class="flex items-center"
    >
      <ToggleGroupItem
        value="positions"
        aria-label="Show positions view"
        class="flex items-center gap-1 data-[state=on]:bg-blue-100"
      >
        <Briefcase class="h-4 w-4" />
        <span class="hidden sm:inline">Positions</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="employees"
        aria-label="Show employees view"
        class="flex items-center gap-1 data-[state=on]:bg-blue-100"
      >
        <Users class="h-4 w-4" />
        <span class="hidden sm:inline">Employees</span>
      </ToggleGroupItem>
    </ToggleGroup>

    <div class="flex-1">
      <Input placeholder="Search by position or employee name..." class="max-w-sm" />
    </div>

    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm">Today</Button>
      <Button variant="outline" size="icon" class="h-8 w-8">
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline" size="icon" class="h-8 w-8">
            <Calendar class="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <CalendarPicker v-model="date" mode="single" />
        </PopoverContent>
      </Popover>
      <Button variant="outline" size="icon" class="h-8 w-8">
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CalendarViewType } from '@/types'
import { Briefcase, Users, ChevronLeft, Calendar, ChevronRight } from 'lucide-vue-next'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'

interface Props {
  modelValue: CalendarViewType
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: CalendarViewType]
}>()

const date = ref(new Date())
</script>
