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

export class AuthService {
  // Get current user
  static async getCurrentUser(): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user: user as AuthUser, error }
  }

  // Get current session
  static async getCurrentSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }

  // Sign up with email and password
  static async signUp({ email, password, metadata }: SignUpData): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { user: data.user as AuthUser, error }
  }

  // Sign in with email and password
  static async signIn({ email, password }: SignInData): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { user: data.user as AuthUser, error }
  }

  // Sign out
  static async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Reset password
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { error }
  }

  // Update password
  static async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    return { error }
  }

  // Update user metadata
  static async updateUserMetadata(metadata: Record<string, any>): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    })
    return { user: data.user as AuthUser, error }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
