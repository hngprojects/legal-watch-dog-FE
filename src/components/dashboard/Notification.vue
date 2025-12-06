<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { notificationService } from '@/api/notification'
import type { Notification, ApiNotification } from '@/types/notification'
import Swal from '@/lib/swal'
import type { AxiosError } from 'axios'

const router = useRouter()

const props = defineProps<{ unreadCount?: number }>()
const emit = defineEmits<{ (e: 'update:unreadCount', value: number): void }>()

const localUnreadCount = ref(props.unreadCount ?? 0)
const notifications = ref<Notification[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

watch(localUnreadCount, (val) => emit('update:unreadCount', val))
watch(
  () => props.unreadCount,
  (val) => {
    if (val !== undefined && val !== localUnreadCount.value) {
      localUnreadCount.value = val
    }
  },
)

const mapToUI = (api: ApiNotification): Notification => ({
  notification_id: api.notification_id,
  iconType:
    api.notification_type.toLowerCase().includes('alert') ||
    api.notification_type.toLowerCase().includes('change')
      ? 'alert'
      : 'regulatory',
  title: api.title || 'No title',
  message: api.content || 'No content',
  time: api.created_at
    ? new Date(api.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Just now',
  severity: api.status === 'PENDING' ? 'high' : 'normal',
  read: api.status !== 'PENDING',
})

const fetchNotifications = async () => {
  loading.value = true
  error.value = null
  try {
    const { data } = await notificationService.getNotifications()
    if (data.status_code !== 200) throw new Error(data.message || 'Failed')

    const res = data.data
    localUnreadCount.value = res.unread_count
    emit('update:unreadCount', res.unread_count)
    notifications.value = res.notifications.map(mapToUI)
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>
    error.value =
      axiosErr.response?.data?.message ?? axiosErr.message ?? 'Failed to load notifications'
  } finally {
    loading.value = false
  }
}

const handleNotificationClick = async (id: string, index: number) => {
  const item = notifications.value[index]
  if (!item) return

  try {
    const { data } = await notificationService.getNotificationContext(id)
    if (data.status_code !== 200) throw new Error()

    const ctx = data.data.context

    if (ctx.project) {
      router.push({ name: 'project-details', params: { id: ctx.project.id } })
    } else if (ctx.source) {
      router.push({ name: 'source-details', params: { id: ctx.source.id } })
    } else if (ctx.revision) {
      router.push({ name: 'revision-details', params: { id: ctx.revision.id } })
    } else if (ctx.change_diff) {
      router.push({ name: 'change-diff', params: { id: ctx.change_diff.id } })
    } else {
      router.push({ name: 'notification-detail', params: { id } })
    }

    if (!item.read) {
      await notificationService.markAsRead([id])
      item.read = true
      localUnreadCount.value = Math.max(0, localUnreadCount.value - 1)
      emit('update:unreadCount', localUnreadCount.value)
    }
  } catch {
    Swal.fire('Error', 'Could not open notification', 'error')
  }
}

const deleteNotification = async (id: string, index: number) => {
  const item = notifications.value[index]
  if (!item) return

  const result = await Swal.fire({
    title: 'Delete notification?',
    text: 'This cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626',
  })

  if (!result.isConfirmed) return

  try {
    await notificationService.deleteNotification(id)
    notifications.value.splice(index, 1)
    if (!item.read) {
      localUnreadCount.value = Math.max(0, localUnreadCount.value - 1)
      emit('update:unreadCount', localUnreadCount.value)
    }
    Swal.fire({ icon: 'success', title: 'Deleted', timer: 1500, showConfirmButton: false })
  } catch {
    Swal.fire('Error', 'Failed to delete', 'error')
  }
}

const markAllAsRead = async () => {
  if (localUnreadCount.value === 0) return

  try {
    const { count } = await notificationService.markAllAsRead()

    notifications.value.forEach((n) => (n.read = true))
    localUnreadCount.value = 0
    emit('update:unreadCount', 0)

    Swal.fire({
      icon: 'success',
      title: `Marked ${count} notification(s) as read`,
      timer: 1800,
      showConfirmButton: false,
    })
  } catch {
    Swal.fire('Error', 'Failed to mark all as read', 'error')
  }
}

onMounted(fetchNotifications)
</script>

<template>
  <div class="w-full rounded-lg border bg-white p-4 shadow-lg sm:w-80">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="font-semibold text-gray-700">Notifications</h3>
      <button
        v-if="localUnreadCount > 0"
        class="text-sm text-blue-600 transition hover:underline"
        @click="markAllAsRead"
      >
        Mark all as read
      </button>
    </div>

    <div v-if="loading" class="py-8 text-center text-sm text-gray-500">Loading...</div>
    <div v-else-if="error" class="py-8 text-center text-sm text-red-500">{{ error }}</div>
    <div v-else-if="notifications.length === 0" class="py-12 text-center text-gray-500">
      <svg
        class="mx-auto mb-4 h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <p class="text-sm font-medium">No notifications yet</p>
    </div>

    <ul v-else class="max-h-96 space-y-3 overflow-y-auto">
      <li
        v-for="(item, index) in notifications"
        :key="item.notification_id"
        class="group relative cursor-pointer rounded-lg border bg-gray-50 p-4 transition-all hover:bg-gray-100"
        @click="handleNotificationClick(item.notification_id, index)"
      >
        <div class="flex items-start gap-3">
          <div
            class="mt-1 h-2 w-2 shrink-0 rounded-full transition-colors"
            :class="{ 'bg-red-500': !item.read, 'bg-green-500': item.read }"
          ></div>

          <div class="min-w-0 flex-1">
            <div class="truncate font-medium text-gray-900">{{ item.title }}</div>
            <div class="mt-1 line-clamp-2 text-sm text-gray-600">{{ item.message }}</div>
            <div class="mt-2 text-xs text-gray-400">{{ item.time }}</div>
          </div>

          <button
            @click.stop="deleteNotification(item.notification_id, index)"
            class="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600"
            aria-label="Delete"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
