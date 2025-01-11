// src/App.vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/app-sidebar/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth.store'
import { useAbilityStore } from '@/stores/ability.store'

// Initialize stores
const authStore = useAuthStore()
const abilityStore = useAbilityStore()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="flex-1 overflow-auto bg-gray-50">
      <SidebarTrigger />
      <RouterView />
    </main>
  </SidebarProvider>
</template>
