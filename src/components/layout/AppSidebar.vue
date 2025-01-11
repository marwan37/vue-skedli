<template>
  <Sidebar>
    <SidebarHeader>
      <h1 class="text-xl font-extralight">skedli</h1>
    </SidebarHeader>

    <SidebarContent>
      <template v-if="filteredDepartmentItems.length > 0">
        <SidebarGroup>
          <SidebarGroupLabel>Department</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in filteredDepartmentItems" :key="item.url">
                <SidebarMenuButton>
                  <RouterLink :to="item.url" class="flex items-center gap-2">
                    <component :is="item.icon" class="h-4 w-4" />
                    <span>{{ item.title }}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </template>

      <template v-if="filteredShiftItems.length > 0">
        <SidebarGroup>
          <SidebarGroupLabel>Shifts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in filteredShiftItems" :key="item.url">
                <SidebarMenuButton>
                  <RouterLink :to="item.url" class="flex items-center gap-2">
                    <component :is="item.icon" class="h-4 w-4" />
                    <span>{{ item.title }}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </template>
    </SidebarContent>

    <SidebarFooter />
  </Sidebar>
</template>

<script setup lang="ts">
import {
  Calendar,
  User,
  Settings,
  ArrowLeftRight,
  Building,
  FileCode,
  Users,
  Clock,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useAbility } from '@/composables/useAbility'

interface NavItem {
  title: string
  url: string
  icon: any
  permission?: boolean
}

const ability = useAbility()

const permissions = computed(() => ({
  MANAGE_ALL: ability.can(Actions.Manage, 'all'),

  SCHEDULES: {
    VIEW: ability.can(Actions.Read, 'schedules'),
  },
  DEPARTMENTS: {
    VIEW: ability.can(Actions.Read, 'departments'),
  },
  USERS: {
    VIEW: ability.can(Actions.Read, 'users'),
  },
  SHIFT_TEMPLATES: {
    VIEW: ability.can(Actions.Read, 'shift-templates'),
  },
  SHIFTS: {
    VIEW: ability.can(Actions.Read, 'shifts'),
  },
  TIME_OFF_REQUESTS: {
    VIEW: ability.can(Actions.Read, 'time-off-requests'),
  },
}))

const departmentItems: NavItem[] = [
  {
    title: 'Schedule',
    url: '/schedule',
    icon: Calendar,
    permission: permissions.value.SCHEDULES.VIEW,
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: Building,
    permission: permissions.value.DEPARTMENTS.VIEW,
  },
  {
    title: 'Employees',
    url: '/employees',
    icon: Users,
    permission: permissions.value.USERS.VIEW,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    permission: permissions.value.MANAGE_ALL,
  },
]

const shiftItems: NavItem[] = [
  {
    title: 'Templates',
    url: '/templates',
    icon: FileCode,
    permission: permissions.value.SHIFT_TEMPLATES.VIEW,
  },
  {
    title: 'Available Shifts',
    url: '/shifts/available',
    icon: Clock,
    permission: permissions.value.SHIFTS.VIEW,
  },
  {
    title: 'Shift Exchanges',
    url: '/shifts/exchanges',
    icon: ArrowLeftRight,
    permission: permissions.value.SHIFTS.VIEW,
  },
  {
    title: 'Time Off',
    url: '/time-off',
    icon: Calendar,
    permission: permissions.value.TIME_OFF_REQUESTS.VIEW,
  },
]

const filteredDepartmentItems = computed(() =>
  departmentItems.filter((item) => item.permission === undefined || item.permission === true),
)

const filteredShiftItems = computed(() =>
  shiftItems.filter((item) => item.permission === undefined || item.permission === true),
)
</script>
