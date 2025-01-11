<!-- components/shifts/ShiftRequirementsModal.vue -->
<template>
  <Dialog :open="modelValue" @update:open="onClose">
    <DialogContent class="max-w-4xl">
      <DialogHeader>
        <DialogTitle>
          {{ mode === 'create' ? 'Create Shift Requirement' : 'Update Shift Requirement' }}
        </DialogTitle>
      </DialogHeader>

      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="details">Shift Details</TabsTrigger>
          <TabsTrigger value="scheduled" :class="isTabUpdated('scheduled')">
            Scheduled Employees ({{ scheduledCount }}/{{ totalRequired }})
          </TabsTrigger>
          <TabsTrigger value="unscheduled" :class="isTabUpdated('unscheduled')">
            Unscheduled Employees ({{ unscheduledEmployees.length }})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" class="mt-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4">
              <div>
                <label for="location" class="block text-sm font-medium mb-1">Location</label>
                <select id="location" class="w-full rounded-md border border-gray-300 p-2">
                  <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
                </select>
              </div>
              <div>
                <label for="department" class="block text-sm font-medium mb-1">Department</label>
                <select id="department" class="w-full rounded-md border border-gray-300 p-2">
                  <option v-for="dept in [...departments].sort()" :key="dept" :value="dept">
                    {{ dept }}
                  </option>
                </select>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label for="shift-type" class="block text-sm font-medium mb-1">Shift Type</label>
                <select id="shift-type" class="w-full rounded-md border border-gray-300 p-2">
                  <option v-for="shift in shiftTemplates" :key="shift.name" :value="shift.name">
                    {{ shift.name }} ({{ shift.startTime }}-{{ shift.endTime }})
                  </option>
                </select>
              </div>
              <div>
                <label for="position" class="block text-sm font-medium mb-1">Position</label>
                <select id="position" class="w-full rounded-md border border-gray-300 p-2">
                  <option
                    v-for="position in [...positions].sort((a, b) => a.name.localeCompare(b.name))"
                    :key="position.id"
                    :value="position.id"
                  >
                    {{ position.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" class="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Weekly Hours</TableHead>
                <TableHead class="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="user in scheduledEmployees" :key="user.id">
                <TableCell>
                  <div>
                    <div class="font-medium">{{ user.fullName }}</div>
                    <div class="text-sm text-gray-500">
                      <p>{{ user.positionId }}</p>
                      <p>{{ user.rate }}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{{ user.weeklyHours }}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" @click="handleUnassign(user)">
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="unscheduled" class="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Availability Set</TableHead>
                <TableHead>Weekly Hours</TableHead>
                <TableHead class="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="user in unscheduledEmployees" :key="user.id">
                <TableCell>
                  <div>
                    <div class="font-medium">{{ user.fullName }}</div>
                    <div class="text-sm text-gray-500">
                      <p>{{ user.positionId }}</p>
                      <p>{{ user.rate }}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{{ user.availabilitySet ? 'Yes' : 'No' }}</TableCell>
                <TableCell>{{ user.weeklyHours }}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    class="text-green-600 hover:text-green-700"
                    @click="handleAssign(user)"
                  >
                    Assign
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <div class="mt-6 flex justify-end space-x-2">
        <Button variant="outline" @click="onClose">Cancel</Button>
        <Button @click="handleSave">Save Changes</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ShiftRequirement, ShiftTemplate, User } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2 } from 'lucide-vue-next'
import { MOCK_DATA } from '@/__mocks/mockData'

interface Props {
  modelValue: boolean
  mode?: 'create' | 'update'
  shiftId?: string
  departmentId: string
  draggedData?: {
    shiftTemplate: ShiftTemplate
    positionId: string
    dayIndex: number
  } | null
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: [scheduledCount: number, totalRequired: number, scheduledEmployees: User[]]
}>()

const activeTab = ref('details')
const scheduledCount = ref(1)
const totalRequired = ref(2)
const recentlyUpdated = ref<string[]>([])
const requirements = ref<ShiftRequirement[]>([])
const scheduledEmployees = ref<User[]>(MOCK_DATA.scheduledEmployees)
const unscheduledEmployees = ref<User[]>(MOCK_DATA.unscheduledEmployees)

const { locations, departments, shiftTemplates, positions } = MOCK_DATA

function handleAssign(employee: User) {
  scheduledEmployees.value.push(employee)
  unscheduledEmployees.value = unscheduledEmployees.value.filter((e) => e.id !== employee.id)
  scheduledCount.value++
  recentlyUpdated.value = ['scheduled', 'unscheduled']
  setTimeout(() => (recentlyUpdated.value = []), 2000)
}

function handleUnassign(employee: User) {
  unscheduledEmployees.value.push(employee)
  scheduledEmployees.value = scheduledEmployees.value.filter((e) => e.id !== employee.id)
  scheduledCount.value--
  recentlyUpdated.value = ['scheduled', 'unscheduled']
  setTimeout(() => (recentlyUpdated.value = []), 2000)
}

function onClose() {
  emit('update:modelValue', false)
}

function handleSave() {
  emit('save', scheduledCount.value, totalRequired.value, scheduledEmployees.value)
  onClose()
}

const isTabUpdated = computed(
  () => (tab: string) =>
    recentlyUpdated.value.includes(tab)
      ? 'ring-2 ring-blue-500 ring-opacity-50 transition-all'
      : '',
)
</script>
