<template>
  <div class="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">Sign in to your account</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card>
        <CardContent class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-2">
              <Label for="email">Email address</Label>
              <Input id="email" v-model="email" type="email" required autocomplete="email" />
            </div>

            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
              />
            </div>

            <Alert v-if="userStore.error" variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {{ userStore.error }}
              </AlertDescription>
            </Alert>

            <Button type="submit" class="w-full" :disabled="userStore.loading">
              <Loader2Icon v-if="userStore.loading" class="mr-2 h-4 w-4 animate-spin" />
              {{ userStore.loading ? 'Signing in...' : 'Sign in' }}
            </Button>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
              </div>
            </div>

            <div class="mt-6">
              <Button variant="outline" class="w-full" @click="handleGoogleSignIn">
                <img src="@/assets/google.svg" alt="Google" class="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/users'
import { Loader2Icon } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

const handleSubmit = async () => {
  const success = await userStore.login(email.value, password.value)
  if (success) {
    router.push('/')
  }
}

const handleGoogleSignIn = async () => {
  // Redirect to Google OAuth URL
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
}
</script>
