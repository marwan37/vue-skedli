<template>
  <div class="container max-w-4xl py-10">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Availability</h1>
        <p class="text-muted-foreground">
          Set your available hours and manage booking preferences.
        </p>
      </div>
      <Button @click="isNewScheduleOpen = true">
        <PlusIcon class="mr-2 h-4 w-4" />
        New Schedule
      </Button>
    </div>

    <Tabs default-value="hours" class="mt-6">
      <TabsList>
        <TabsTrigger value="hours">Available Hours</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      <TabsContent value="hours">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription> Set your weekly available hours for meetings. </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="day in weekDays" :key="day" class="flex items-center space-x-4">
                <div class="w-32">
                  <Label>{{ day }}</Label>
                </div>
                <div class="flex-1 space-y-2">
                  <div
                    v-for="(slot, index) in getTimeSlots(day)"
                    :key="index"
                    class="flex items-center space-x-2"
                  >
                    <Select v-model="slot.start">
                      <SelectTrigger>
                        <SelectValue :placeholder="slot.start" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem v-for="time in availableTimes" :key="time" :value="time">
                            {{ time }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select v-model="slot.end">
                      <SelectTrigger>
                        <SelectValue :placeholder="slot.end" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            v-for="time in availableTimes"
                            :key="time"
                            :value="time"
                            :disabled="isEndTimeDisabled(time, slot.start)"
                          >
                            {{ time }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" @click="removeTimeSlot(day, index)">
                      <TrashIcon class="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    @click="addTimeSlot(day)"
                    :disabled="!canAddTimeSlot(day)"
                  >
                    <PlusIcon class="mr-2 h-4 w-4" />
                    Add Time Slot
                  </Button>
                </div>
                <div class="w-24">
                  <Switch :id="`${day}-available`" v-model="availability[day].enabled" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button @click="saveAvailability" :disabled="isSaving">
              <Loader2Icon v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Booking Preferences</CardTitle>
            <CardDescription> Configure your booking settings and restrictions. </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div class="space-y-2">
                <Label>Minimum Notice</Label>
                <Select v-model="preferences.minimumNotice">
                  <SelectTrigger>
                    <SelectValue placeholder="Select minimum notice period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">No minimum</SelectItem>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label>Maximum Booking Window</Label>
                <Select v-model="preferences.maxBookingWindow">
                  <SelectTrigger>
                    <SelectValue placeholder="Select maximum booking window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="14">2 weeks</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                      <SelectItem value="90">3 months</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label>Default Meeting Duration</Label>
                <Select v-model="preferences.defaultDuration">
                  <SelectTrigger>
                    <SelectValue placeholder="Select default duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button @click="savePreferences" :disabled="isSaving">
              <Loader2Icon v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>

    <Dialog v-model:open="isNewScheduleOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
          <DialogDescription>
            Create a new availability schedule for different purposes.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Schedule Name</Label>
            <Input v-model="newSchedule.name" placeholder="e.g., Work Hours, Consultation" />
          </div>
          <div class="space-y-2">
            <Label>Description</Label>
            <Textarea
              v-model="newSchedule.description"
              placeholder="Brief description of this schedule's purpose"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isNewScheduleOpen = false"> Cancel </Button>
          <Button @click="createSchedule" :disabled="isSaving">
            <Loader2Icon v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { PlusIcon, TrashIcon, Loader2Icon } from 'lucide-vue-next'

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const isNewScheduleOpen = ref(false)
const isSaving = ref(false)

interface TimeSlot {
  start: string
  end: string
}

interface DayAvailability {
  enabled: boolean
  slots: TimeSlot[]
}

const availability = reactive(
  weekDays.reduce(
    (acc, day) => ({
      ...acc,
      [day]: {
        enabled: true,
        slots: [{ start: '09:00', end: '17:00' }],
      },
    }),
    {} as Record<string, DayAvailability>,
  ),
)

const preferences = reactive({
  minimumNotice: '24',
  maxBookingWindow: '30',
  defaultDuration: '30',
})

const newSchedule = reactive({
  name: '',
  description: '',
})

const availableTimes = computed(() => {
  const times = []
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      times.push(`${i.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')}`)
    }
  }
  return times
})

const getTimeSlots = (day: string) => availability[day].slots

const addTimeSlot = (day: string) => {
  availability[day].slots.push({ start: '09:00', end: '17:00' })
}

const removeTimeSlot = (day: string, index: number) => {
  availability[day].slots.splice(index, 1)
}

const canAddTimeSlot = (day: string) => {
  return availability[day].slots.length < 3
}

const isEndTimeDisabled = (time: string, start: string) => {
  return time <= start
}

const saveAvailability = async () => {
  isSaving.value = true
  try {
    // Implement save availability logic
    await new Promise((resolve) => setTimeout(resolve, 1000))
  } finally {
    isSaving.value = false
  }
}

const savePreferences = async () => {
  isSaving.value = true
  try {
    // Implement save preferences logic
    await new Promise((resolve) => setTimeout(resolve, 1000))
  } finally {
    isSaving.value = false
  }
}

const createSchedule = async () => {
  isSaving.value = true
  try {
    // Implement create schedule logic
    await new Promise((resolve) => setTimeout(resolve, 1000))
    isNewScheduleOpen.value = false
    newSchedule.name = ''
    newSchedule.description = ''
  } finally {
    isSaving.value = false
  }
}
</script>
