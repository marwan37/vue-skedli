<template>
  <div class="container max-w-2xl py-10">
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription> Manage your account settings and preferences. </CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-4">
          <div class="space-y-2">
            <Label>Profile Picture</Label>
            <div class="flex items-center gap-4">
              <div class="relative h-20 w-20">
                <img
                  v-if="userStore.currentUser?.avatar"
                  :src="userStore.currentUser.avatar"
                  alt="Profile"
                  class="rounded-full object-cover"
                />
                <div
                  v-else
                  class="flex h-20 w-20 items-center justify-center rounded-full bg-muted"
                >
                  {{ userStore.currentUser?.name?.[0] }}
                </div>
                <div class="absolute bottom-0 right-0">
                  <Label
                    for="avatar-upload"
                    class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                  >
                    <PencilIcon class="h-4 w-4" />
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleAvatarUpload"
                    />
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <Label for="name">Name</Label>
            <Input id="name" v-model="form.name" :placeholder="userStore.currentUser?.name" />
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="form.email"
              :placeholder="userStore.currentUser?.email"
              disabled
            />
          </div>

          <div class="space-y-2">
            <Label>Calendar Integration</Label>
            <div class="flex items-center space-x-2">
              <Switch v-model="form.calendarSync" id="calendar-sync" />
              <Label for="calendar-sync">Sync with Google Calendar</Label>
            </div>
          </div>
        </div>

        <Alert v-if="error" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

        <div class="flex justify-end">
          <Button type="submit" :disabled="isSaving" @click="saveSettings">
            <Loader2Icon v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            {{ isSaving ? 'Saving...' : 'Save changes' }}
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card class="mt-6">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription> Irreversible and destructive actions </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                class="bg-destructive text-destructive-foreground"
                @click="deleteAccount"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/stores/users'
import { PencilIcon, Loader2Icon } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const error = ref('')
const isSaving = ref(false)

const form = reactive({
  name: userStore.currentUser?.name || '',
  email: userStore.currentUser?.email || '',
  calendarSync: false,
})

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const formData = new FormData()
  formData.append('avatar', file)

  try {
    // Implement avatar upload logic
    // await userStore.updateAvatar(formData)
  } catch (e) {
    error.value = (e as Error).message
  }
}

const saveSettings = async () => {
  isSaving.value = true
  try {
    // Implement settings save logic
    // await userStore.updateSettings(form)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    isSaving.value = false
  }
}

const deleteAccount = async () => {
  try {
    // Implement account deletion logic
    // await userStore.deleteAccount()
    await userStore.logout()
    router.push('/login')
  } catch (e) {
    error.value = (e as Error).message
  }
}
</script>
