<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-4">
      <div>
        <Label for="title">Title</Label>
        <Input id="title" v-model="form.title" required />
      </div>

      <div>
        <Label for="description">Description</Label>
        <Textarea id="description" v-model="form.description" />
      </div>

      <div>
        <Label for="startDate">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" class="w-full justify-start text-left font-normal">
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ form.start ? format(form.start, 'PPP') : 'Pick a date' }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar mode="single" v-model="form.start" />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label for="startTime">Start Time</Label>
        <Select v-model="startTime">
          <SelectTrigger>
            <SelectValue :placeholder="startTime || 'Select time'" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="time in timeSlots" :key="time" :value="time">
                {{ time }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label for="endDate">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" class="w-full justify-start text-left font-normal">
              <CalendarIcon class="mr-2 h-4 w-4" />
              {{ form.end ? format(form.end, 'PPP') : 'Pick a date' }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar
              mode="single"
              v-model="form.end"
              :disabled-date="(date) => date < form.start"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label for="endTime">End Time</Label>
        <Select v-model="endTime">
          <SelectTrigger>
            <SelectValue :placeholder="endTime || 'Select time'" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="time in timeSlots"
                :key="time"
                :value="time"
                :disabled="isTimeDisabled(time)"
              >
                {{ time }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>

    <AlertDialog :open="showValidationError">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invalid Time Selection</AlertDialogTitle>
          <AlertDialogDescription> End time must be after start time. </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction @click="showValidationError = false"> OK </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <div class="flex justify-end space-x-2">
      <Button variant="outline" type="button" @click="$emit('cancel')"> Cancel </Button>
      <Button type="submit" :disabled="isSubmitting">
        <Loader2Icon v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        Save
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format, parse, isBefore, setHours, setMinutes } from 'date-fns'
import { CalendarIcon, Loader2Icon } from 'lucide-vue-next'
import type { Event } from '@/types'

const props = defineProps<{
  event?: Event
}>()

const emit = defineEmits<{
  (e: 'save', event: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): void
  (e: 'cancel'): void
}>()

const form = ref({
  title: props.event?.title ?? '',
  description: props.event?.description ?? '',
  start: props.event ? new Date(props.event.start) : new Date(),
  end: props.event ? new Date(props.event.end) : new Date(),
})

const startTime = ref(props.event ? format(new Date(props.event.start), 'HH:mm') : '')
const endTime = ref(props.event ? format(new Date(props.event.end), 'HH:mm') : '')
const isSubmitting = ref(false)
const showValidationError = ref(false)

const timeSlots = computed(() => {
  const slots = []
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      slots.push(`${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`)
    }
  }
  return slots
})

const isTimeDisabled = (time: string) => {
  if (!form.value.start || !form.value.end || !startTime.value) return false

  if (form.value.start.getTime() === form.value.end.getTime()) {
    const [startHours, startMinutes] = startTime.value.split(':').map(Number)
    const [endHours, endMinutes] = time.split(':').map(Number)
    return endHours < startHours || (endHours === startHours && endMinutes <= startMinutes)
  }
  return false
}

const handleSubmit = async () => {
  if (!startTime.value || !endTime.value) return

  const startDateTime = setMinutes(
    setHours(form.value.start, parseInt(startTime.value.split(':')[0])),
    parseInt(startTime.value.split(':')[1]),
  )

  const endDateTime = setMinutes(
    setHours(form.value.end, parseInt(endTime.value.split(':')[0])),
    parseInt(endTime.value.split(':')[1]),
  )

  if (isBefore(endDateTime, startDateTime)) {
    showValidationError.value = true
    return
  }

  try {
    isSubmitting.value = true
    emit('save', {
      title: form.value.title,
      description: form.value.description,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
