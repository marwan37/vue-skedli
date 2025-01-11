<!-- components/department/DepartmentProfile.vue -->
<template>
  <div class="space-y-6 p-6">
    <Card>
      <CardHeader>
        <CardTitle>{{ departmentName }} Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Input v-model="departmentName" placeholder="Department Name" class="max-w-sm" />
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <CardTitle>{{ departmentName }} Shift Types</CardTitle>
        <Button @click="isShiftDialogOpen = true">
          <Plus class="mr-2 h-4 w-4" />
          Add Shift Type
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead class="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="shift in shiftTypes" :key="shift.id">
              <TableCell>{{ shift.name }}</TableCell>
              <TableCell>{{ shift.shortName }}</TableCell>
              <TableCell>{{ shift.startTime }}</TableCell>
              <TableCell>{{ shift.endTime }}</TableCell>
              <TableCell class="space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit2 class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 class="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <CardTitle>{{ departmentName }} Availability Types</CardTitle>
        <Button @click="isAvailabilityDialogOpen = true">
          <Plus class="mr-2 h-4 w-4" />
          Add Availability Type
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead class="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="type in availabilityTypes" :key="type.id">
              <TableCell>{{ type.name }}</TableCell>
              <TableCell>{{ type.startTime }}</TableCell>
              <TableCell>{{ type.endTime }}</TableCell>
              <TableCell class="space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit2 class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 class="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Dialog v-model:open="isShiftDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Shift Type</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="shift-name">Name</Label>
            <Input id="shift-name" v-model="newShift.name" />
          </div>
          <div>
            <Label for="shift-short-name">Short Name</Label>
            <Input id="shift-short-name" v-model="newShift.shortName" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="shift-start">Start Time</Label>
              <Input id="shift-start" type="time" v-model="newShift.startTime" />
            </div>
            <div>
              <Label for="shift-end">End Time</Label>
              <Input id="shift-end" type="time" v-model="newShift.endTime" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button @click="handleAddShift">Add Shift Type</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="isAvailabilityDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Availability Type</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="availability-name">Name</Label>
            <Input id="availability-name" v-model="newAvailability.name" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="availability-start">Start Time</Label>
              <Input id="availability-start" type="time" v-model="newAvailability.startTime" />
            </div>
            <div>
              <Label for="availability-end">End Time</Label>
              <Input id="availability-end" type="time" v-model="newAvailability.endTime" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button @click="handleAddAvailability">Add Availability Type</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Edit2, Trash2, Plus } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface ShiftType {
  id: string
  name: string
  shortName: string
  startTime: string
  endTime: string
}

interface AvailabilityType {
  id: string
  name: string
  startTime: string
  endTime: string
}

interface NewShiftTemplate {
  name: string
  shortName: string
  startTime: string
  endTime: string
}

interface NewAvailabilityTemplate {
  name: string
  startTime: string
  endTime: string
}

const departmentName = ref('Development')
const isShiftDialogOpen = ref(false)
const isAvailabilityDialogOpen = ref(false)

const shiftTypes = ref<ShiftType[]>([
  { id: '1', name: 'Morning Shift', shortName: 'MS', startTime: '07:00', endTime: '15:00' },
])

const availabilityTypes = ref<AvailabilityType[]>([
  { id: '1', name: 'Standard Hours', startTime: '09:00', endTime: '17:00' },
])

const newShift = ref<NewShiftTemplate>({
  name: '',
  shortName: '',
  startTime: '',
  endTime: '',
})

const newAvailability = ref<NewAvailabilityTemplate>({
  name: '',
  startTime: '',
  endTime: '',
})

function handleAddShift() {
  const id = (shiftTypes.value.length + 1).toString()
  shiftTypes.value.push({ id, ...newShift.value })
  newShift.value = { name: '', shortName: '', startTime: '', endTime: '' }
  isShiftDialogOpen.value = false
}

function handleAddAvailability() {
  const id = (availabilityTypes.value.length + 1).toString()
  availabilityTypes.value.push({ id, ...newAvailability.value })
  newAvailability.value = { name: '', startTime: '', endTime: '' }
  isAvailabilityDialogOpen.value = false
}
</script>
