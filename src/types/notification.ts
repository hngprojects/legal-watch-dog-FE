export interface ApiResponse<T = unknown> {
  status: string
  status_code: number
  message?: string
  data: T
}

export interface ApiNotification {
  notification_id: string
  user_id: string
  title: string
  content: string
  notification_type: string
  status: 'PENDING' | 'READ'
  created_at: string
  updated_at?: string
  organization_id?: string
  source_id?: string
  jurisdiction_id?: string
  action_url?: string
}

export interface ApiNotificationListResponse {
  notifications: ApiNotification[]
  total: number
  page: number
  page_size: number
  unread_count: number
}

export interface NotificationContext {
  notification: {
    id: string
    title: string
    content: string
    notification_type: string
    is_read: boolean
    created_at: string
  }
  context: {
    project?: { id: string; name: string; status: string }
    organization?: { id: string; name: string }
    source?: { id: string; type: string }
    revision?: { id: string }
    change_diff?: { id: string }
  }
}

export interface MarkReadRequest {
  notification_ids: string[]
}

export interface MarkReadResponse {
  count: number
}
export interface NotificationStats {
  total_notifications: number
  unread_count: number
  read_count: number
  by_type: Record<string, number>
  by_status: Record<string, number>
  recent_activity: {
    last_24_hours: number
    last_7_days: number
    last_30_days: number
  }
}

export interface Notification {
  notification_id: string
  iconType: 'regulatory' | 'alert'
  title: string
  message: string
  time: string
  severity: 'normal' | 'high'
  read: boolean
}
