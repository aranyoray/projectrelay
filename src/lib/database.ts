import { supabase } from './supabase'

// Database types - customize these based on your actual database schema
export interface Project {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
  user_id?: string
}

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

// Generic database operations
export class DatabaseService {
  // Generic fetch function
  static async fetch<T>(
    table: string,
    select: string = '*',
    filters?: Record<string, any>
  ): Promise<{ data: T[] | null; error: any }> {
    let query = supabase.from(table).select(select)
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    const { data, error } = await query
    return { data, error }
  }

  // Generic insert function
  static async insert<T>(
    table: string,
    data: Partial<T>
  ): Promise<{ data: T | null; error: any }> {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single()
    
    return { data: result, error }
  }

  // Generic update function
  static async update<T>(
    table: string,
    id: string,
    data: Partial<T>
  ): Promise<{ data: T | null; error: any }> {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    return { data: result, error }
  }

  // Generic delete function
  static async delete(
    table: string,
    id: string
  ): Promise<{ error: any }> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    return { error }
  }
}

// Project-specific operations
export class ProjectService {
  static async getAllProjects(): Promise<{ data: Project[] | null; error: any }> {
    return DatabaseService.fetch<Project>('projects')
  }

  static async getProjectById(id: string): Promise<{ data: Project | null; error: any }> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  }

  static async createProject(project: Partial<Project>): Promise<{ data: Project | null; error: any }> {
    return DatabaseService.insert<Project>('projects', project)
  }

  static async updateProject(id: string, project: Partial<Project>): Promise<{ data: Project | null; error: any }> {
    return DatabaseService.update<Project>('projects', id, project)
  }

  static async deleteProject(id: string): Promise<{ error: any }> {
    return DatabaseService.delete('projects', id)
  }
}

// User-specific operations
export class UserService {
  static async getUserById(id: string): Promise<{ data: User | null; error: any }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  }

  static async createUser(user: Partial<User>): Promise<{ data: User | null; error: any }> {
    return DatabaseService.insert<User>('users', user)
  }

  static async updateUser(id: string, user: Partial<User>): Promise<{ data: User | null; error: any }> {
    return DatabaseService.update<User>('users', id, user)
  }
}
