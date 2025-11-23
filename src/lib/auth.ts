import { supabase } from './supabase'
import { User, Session, AuthError } from '@supabase/supabase-js'

export interface AuthUser extends User {
  // Add any custom user properties here
}

export interface SignUpData {
  email: string
  password: string
  metadata?: Record<string, any>
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthResult<T> {
  data: T | null
  error: AuthError | Error | null
}

// Validation helpers
export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Invalid email format'
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}

export function validateUsername(username: string): string | null {
  if (!username) return 'Username is required'
  if (username.length < 3) return 'Username must be at least 3 characters'
  if (username.length > 30) return 'Username must be less than 30 characters'
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores'
  return null
}

export function validateZipCode(zip: string): string | null {
  if (!zip) return null // Optional field
  if (!/^\d{5}(-\d{4})?$/.test(zip)) return 'Invalid ZIP code format'
  return null
}

export class AuthService {
  // Get current user
  static async getCurrentUser(): Promise<{ user: AuthUser | null; error: AuthError | Error | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user: user as AuthUser, error }
    } catch (err) {
      return { user: null, error: err instanceof Error ? err : new Error('Failed to get current user') }
    }
  }

  // Get current session
  static async getCurrentSession(): Promise<{ session: Session | null; error: AuthError | Error | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      return { session, error }
    } catch (err) {
      return { session: null, error: err instanceof Error ? err : new Error('Failed to get session') }
    }
  }

  // Sign up with email and password
  static async signUp({ email, password, metadata }: SignUpData): Promise<{ user: AuthUser | null; error: AuthError | Error | null }> {
    try {
      // Validate inputs
      const emailError = validateEmail(email)
      if (emailError) return { user: null, error: new Error(emailError) }

      const passwordError = validatePassword(password)
      if (passwordError) return { user: null, error: new Error(passwordError) }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      return { user: data?.user as AuthUser | null, error }
    } catch (err) {
      return { user: null, error: err instanceof Error ? err : new Error('Failed to sign up') }
    }
  }

  // Sign in with email and password
  static async signIn({ email, password }: SignInData): Promise<{ user: AuthUser | null; error: AuthError | Error | null }> {
    try {
      // Validate inputs
      const emailError = validateEmail(email)
      if (emailError) return { user: null, error: new Error(emailError) }

      if (!password) return { user: null, error: new Error('Password is required') }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { user: data?.user as AuthUser | null, error }
    } catch (err) {
      return { user: null, error: err instanceof Error ? err : new Error('Failed to sign in') }
    }
  }

  // Sign out
  static async signOut(): Promise<{ error: AuthError | Error | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Failed to sign out') }
    }
  }

  // Reset password
  static async resetPassword(email: string, redirectUrl?: string): Promise<{ error: AuthError | Error | null }> {
    try {
      const emailError = validateEmail(email)
      if (emailError) return { error: new Error(emailError) }

      const baseUrl = redirectUrl || (typeof window !== 'undefined' ? window.location.origin : '')
      if (!baseUrl) return { error: new Error('Unable to determine redirect URL') }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/reset-password`
      })
      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Failed to reset password') }
    }
  }

  // Update password
  static async updatePassword(newPassword: string): Promise<{ error: AuthError | Error | null }> {
    try {
      const passwordError = validatePassword(newPassword)
      if (passwordError) return { error: new Error(passwordError) }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Failed to update password') }
    }
  }

  // Update user metadata
  static async updateUserMetadata(metadata: Record<string, any>): Promise<{ user: AuthUser | null; error: AuthError | Error | null }> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata
      })
      return { user: data?.user as AuthUser | null, error }
    } catch (err) {
      return { user: null, error: err instanceof Error ? err : new Error('Failed to update user metadata') }
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
