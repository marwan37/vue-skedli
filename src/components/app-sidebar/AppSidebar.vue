<!-- components/app-sidebar/AppSidebar.vue -->
<template>
  <Sidebar>
    <SidebarHeader>
      <h1 class="text-xl font-extralight">skedli</h1>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-if="departmentItems.length">
        <SidebarGroupLabel>Department</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in departmentItems" :key="item.url">
              <SidebarMenuButton as-child>
                <RouterLink :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup v-if="shiftItems.length">
        <SidebarGroupLabel>Shifts</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in shiftItems" :key="item.url">
              <SidebarMenuButton as-child>
                <RouterLink :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter />
  </Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
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
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import { useFeaturePermissions } from '@/composables/useFeaturePermissions'

interface NavItem {
  title: string
  url: string
  icon: any
  permission?: boolean
}

const permissions = useFeaturePermissions()

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
