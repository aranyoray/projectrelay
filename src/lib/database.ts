import { supabase } from './supabase'

// Enums
export type ProjectCategory = 'project' | 'initiative' | 'organization'
export type ProjectArea = 'science_research' | 'tech' | 'engineering' | 'journalism' | 'nonprofit' | 'other'
export type TimeCommitment = '1-2' | '2-5' | '5-10' | '10-15' | '15-20' | '20+'
export type ProjectAge = '0-6m' | '6m-1y' | '1y-3y' | '3y-5y' | '5y+'
export type CommitmentLevel = 'low' | 'medium' | 'high'

// User Profile
export interface UserProfile {
  id: string
  user_id: string
  first_name: string
  last_name?: string
  age?: number
  location?: string
  state?: string
  zip?: string
  high_school?: string
  interests: string[]
  time_commitment: TimeCommitment[]
  has_team: boolean
  points: number
  is_premium: boolean
  created_at: string
  updated_at: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

// Project
export interface Project {
  id: string
  user_id: string
  name: string
  age_months: number
  time_commitment: TimeCommitment
  category: ProjectCategory
  area: ProjectArea
  description: string
  notes_recognitions?: string
  video_url?: string
  materials_url?: string
  website_url?: string
  price?: number
  is_active: boolean
  commitment_level: CommitmentLevel
  state?: string
  created_at: string
  updated_at: string
  // Joined fields
  owner?: UserProfile
  bookmark_count?: number
  is_bookmarked?: boolean
}

// Message/DM
export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  project_id?: string
  content: string
  is_read: boolean
  message_type: 'contact' | 'transfer_request' | 'general'
  offer_amount?: number
  created_at: string
}

// Notification
export interface Notification {
  id: string
  user_id: string
  type: 'message' | 'transfer_request' | 'transfer_accepted' | 'transfer_rejected' | 'system'
  title: string
  content: string
  is_read: boolean
  related_id?: string
  created_at: string
}

// Bookmark
export interface Bookmark {
  id: string
  user_id: string
  project_id: string
  created_at: string
}

// Transaction
export interface Transaction {
  id: string
  buyer_id: string
  seller_id: string
  project_id: string
  amount: number
  platform_fee: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  stripe_payment_id?: string
  created_at: string
}

// User weekly request tracking
export interface WeeklyRequests {
  id: string
  user_id: string
  week_start: string
  request_count: number
}

// Database operations
export class DatabaseService {
  static async fetch<T>(
    table: string,
    select: string = '*',
    filters?: AnyRecord
  ): Promise<{ data: T[] | null; error: Error | null }> {
    try {
      let query = supabase.from(table).select(select)

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }

      const { data, error } = await query
      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Database fetch failed') }
    }
  }

  static async insert<T>(
    table: string,
    data: Partial<T>
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single()

      return { data: result, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Database insert failed') }
    }
  }

  static async update<T>(
    table: string,
    id: string,
    data: Partial<T>
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()

      return { data: result, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Database update failed') }
    }
  }

  static async delete(
    table: string,
    id: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Database delete failed') }
    }
  }
}

// Project Service
export class ProjectService {
  static async getAllProjects(filters?: {
    area?: ProjectArea
    state?: string
    age?: ProjectAge
    commitment?: CommitmentLevel
    search?: string
  }): Promise<{ data: Project[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (filters?.area) {
        query = query.eq('area', filters.area)
      }
      if (filters?.state) {
        query = query.eq('state', filters.state)
      }
      if (filters?.commitment) {
        query = query.eq('commitment_level', filters.commitment)
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query
      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to fetch projects') }
    }
  }

  static async getProjectById(id: string): Promise<{ data: Project | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to fetch project') }
    }
  }

  static async getProjectsByUserId(userId: string): Promise<{ data: Project[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to fetch user projects') }
    }
  }

  static async createProject(project: Partial<Project>): Promise<{ data: Project | null; error: Error | null }> {
    return DatabaseService.insert<Project>('projects', project)
  }

  static async updateProject(id: string, project: Partial<Project>): Promise<{ data: Project | null; error: Error | null }> {
    return DatabaseService.update<Project>('projects', id, project)
  }

  static async deleteProject(id: string): Promise<{ error: Error | null }> {
    return DatabaseService.delete('projects', id)
  }

  static async getRecommendedProjects(userInterests: string[], limit: number = 5): Promise<{ data: Project[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to fetch recommended projects') }
    }
  }

  static async getNearbyProjects(state: string, limit: number = 10): Promise<{ data: Project[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .eq('state', state)
        .order('created_at', { ascending: false })
        .limit(limit)

      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to fetch nearby projects') }
    }
  }
}

// User Profile Service
export class UserProfileService {
  static async getProfileByUserId(userId: string): Promise<{ data: UserProfile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to fetch profile') }
    }
  }

  static async createProfile(profile: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: Error | null }> {
    return DatabaseService.insert<UserProfile>('user_profiles', profile)
  }

  static async updateProfile(id: string, profile: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: Error | null }> {
    return DatabaseService.update<UserProfile>('user_profiles', id, profile)
  }

  static async deductPoints(userId: string, amount: number): Promise<{ error: Error | null }> {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('points')
        .eq('user_id', userId)
        .single()

      if (!profile || profile.points < amount) {
        return { error: new Error('Insufficient points') }
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ points: profile.points - amount })
        .eq('user_id', userId)

      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Failed to deduct points') }
    }
  }
}

// Bookmark Service
export class BookmarkService {
  static async getUserBookmarks(userId: string): Promise<{ data: Bookmark[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*, project:projects(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to fetch bookmarks') }
    }
  }

  static async addBookmark(userId: string, projectId: string): Promise<{ data: Bookmark | null; error: Error | null }> {
    return DatabaseService.insert<Bookmark>('bookmarks', { user_id: userId, project_id: projectId })
  }

  static async removeBookmark(userId: string, projectId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('project_id', projectId)

      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Failed to remove bookmark') }
    }
  }

  static async isBookmarked(userId: string, projectId: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('project_id', projectId)
        .single()

      return !!data
    } catch {
      return false
    }
  }
}

// Message Service
export class MessageService {
  static async sendMessage(message: Partial<Message>): Promise<{ data: Message | null; error: Error | null }> {
    return DatabaseService.insert<Message>('messages', message)
  }

  static async getConversations(userId: string): Promise<{ data: Message[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to fetch conversations') }
    }
  }

  static async markAsRead(messageId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)

      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Failed to mark as read') }
    }
  }
}

// Notification Service
export class NotificationService {
  static async getUserNotifications(userId: string): Promise<{ data: Notification[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Failed to fetch notifications') }
    }
  }

  static async createNotification(notification: Partial<Notification>): Promise<{ data: Notification | null; error: Error | null }> {
    return DatabaseService.insert<Notification>('notifications', notification)
  }

  static async markAsRead(notificationId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Failed to mark notification as read') }
    }
  }

  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)

      return count || 0
    } catch {
      return 0
    }
  }
}

// Transaction Service
export class TransactionService {
  static async createTransaction(transaction: Partial<Transaction>): Promise<{ data: Transaction | null; error: Error | null }> {
    return DatabaseService.insert<Transaction>('transactions', transaction)
  }

  static async updateTransactionStatus(id: string, status: Transaction['status'], stripePaymentId?: string): Promise<{ error: Error | null }> {
    try {
      const updateData: { status: Transaction['status']; stripe_payment_id?: string } = { status }
      if (stripePaymentId) {
        updateData.stripe_payment_id = stripePaymentId
      }

      const { error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)

      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Failed to update transaction') }
    }
  }
}

// Weekly Request Tracking
export class RequestTrackingService {
  static async getWeeklyRequestCount(userId: string): Promise<number> {
    try {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)

      const { data } = await supabase
        .from('weekly_requests')
        .select('request_count')
        .eq('user_id', userId)
        .gte('week_start', weekStart.toISOString())
        .single()

      return data?.request_count || 0
    } catch {
      return 0
    }
  }

  static async incrementRequestCount(userId: string): Promise<{ error: Error | null }> {
    try {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      weekStart.setHours(0, 0, 0, 0)

      const { data: existing } = await supabase
        .from('weekly_requests')
        .select('*')
        .eq('user_id', userId)
        .gte('week_start', weekStart.toISOString())
        .single()

      if (existing) {
        const { error } = await supabase
          .from('weekly_requests')
          .update({ request_count: existing.request_count + 1 })
          .eq('id', existing.id)
        return { error }
      } else {
        const { error } = await supabase
          .from('weekly_requests')
          .insert({
            user_id: userId,
            week_start: weekStart.toISOString(),
            request_count: 1
          })
        return { error }
      }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Failed to increment request count') }
    }
  }

  static canMakeRequest(currentCount: number, isPremium: boolean): boolean {
    const limit = isPremium ? 50 : 10
    return currentCount < limit
  }
}
