export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      account_requests: {
        Row: {
          address: string
          birth_date: string
          created_at: string | null
          email: string
          employer_address: string | null
          employer_name: string | null
          first_name: string
          funds_source_confirmed: boolean | null
          id: string
          id_back_image: string | null
          id_front_image: string | null
          id_number: string | null
          id_type: string[]
          income_sources: string[]
          last_name: string
          occupation: string
          other_id_type: string | null
          other_income_source: string | null
          phone_number: string
          postnom: string | null
          privacy_accepted: boolean | null
          signature_url: string | null
          signer_name: string | null
          status: string | null
          terms_accepted: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          birth_date: string
          created_at?: string | null
          email: string
          employer_address?: string | null
          employer_name?: string | null
          first_name: string
          funds_source_confirmed?: boolean | null
          id?: string
          id_back_image?: string | null
          id_front_image?: string | null
          id_number?: string | null
          id_type: string[]
          income_sources: string[]
          last_name: string
          occupation: string
          other_id_type?: string | null
          other_income_source?: string | null
          phone_number: string
          postnom?: string | null
          privacy_accepted?: boolean | null
          signature_url?: string | null
          signer_name?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          address?: string
          birth_date?: string
          created_at?: string | null
          email?: string
          employer_address?: string | null
          employer_name?: string | null
          first_name?: string
          funds_source_confirmed?: boolean | null
          id?: string
          id_back_image?: string | null
          id_front_image?: string | null
          id_number?: string | null
          id_type?: string[]
          income_sources?: string[]
          last_name?: string
          occupation?: string
          other_id_type?: string | null
          other_income_source?: string | null
          phone_number?: string
          postnom?: string | null
          privacy_accepted?: boolean | null
          signature_url?: string | null
          signer_name?: string | null
          status?: string | null
          terms_accepted?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      claims: {
        Row: {
          claimed_at: string
          claimed_by: string
          id: string
          project_id: string
        }
        Insert: {
          claimed_at?: string
          claimed_by: string
          id?: string
          project_id: string
        }
        Update: {
          claimed_at?: string
          claimed_by?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_claimed_by_fkey"
            columns: ["claimed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          bio: string | null
          city: string | null
          created_at: string | null
          email: string
          id: string
          image_path: string | null
          image_url: string | null
          name: string
          phone: string | null
          skills: string | null
          title: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          id?: string
          image_path?: string | null
          image_url?: string | null
          name: string
          phone?: string | null
          skills?: string | null
          title?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          id?: string
          image_path?: string | null
          image_url?: string | null
          name?: string
          phone?: string | null
          skills?: string | null
          title?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          file_format: string | null
          file_path: string | null
          id: string
          name: string
          status: string | null
          task_id: string
          type: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_format?: string | null
          file_path?: string | null
          id?: string
          name: string
          status?: string | null
          task_id: string
          type?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_format?: string | null
          file_path?: string | null
          id?: string
          name?: string
          status?: string | null
          task_id?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          end_date: string | null
          end_time: string | null
          id: string
          manager_id: string | null
          order_index: number
          priority: Database["public"]["Enums"]["milestone_priority"]
          project_id: string
          start_date: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["milestone_status"]
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          manager_id?: string | null
          order_index: number
          priority?: Database["public"]["Enums"]["milestone_priority"]
          project_id: string
          start_date?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["milestone_status"]
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          manager_id?: string | null
          order_index?: number
          priority?: Database["public"]["Enums"]["milestone_priority"]
          project_id?: string
          start_date?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["milestone_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          id: string
          is_active: boolean
          project_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          project_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          createdAt: string | null
          id: string | null
          name: string | null
        }
        Insert: {
          createdAt?: string | null
          id?: string | null
          name?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: string | null
          name?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          approved_at: string | null
          assigned_at: string | null
          categories: string[] | null
          claim_count: number | null
          claim_id: string
          collaborators: Json | null
          created_at: string | null
          description: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          links: string[] | null
          logo_urls: string[] | null
          parent_name: string | null
          phase: string | null
          phone: string | null
          project_city: string | null
          project_id: string
          province: string | null
          residence_city: string | null
          signature: string | null
          signer_name: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          title: string
        }
        Insert: {
          approved_at?: string | null
          assigned_at?: string | null
          categories?: string[] | null
          claim_count?: number | null
          claim_id?: string
          collaborators?: Json | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          links?: string[] | null
          logo_urls?: string[] | null
          parent_name?: string | null
          phase?: string | null
          phone?: string | null
          project_city?: string | null
          project_id: string
          province?: string | null
          residence_city?: string | null
          signature?: string | null
          signer_name?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title: string
        }
        Update: {
          approved_at?: string | null
          assigned_at?: string | null
          categories?: string[] | null
          claim_count?: number | null
          claim_id?: string
          collaborators?: Json | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          links?: string[] | null
          logo_urls?: string[] | null
          parent_name?: string | null
          phase?: string | null
          phone?: string | null
          project_city?: string | null
          project_id?: string
          province?: string | null
          residence_city?: string | null
          signature?: string | null
          signer_name?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          createdAt: string | null
          id: string | null
          name: string | null
        }
        Insert: {
          createdAt?: string | null
          id?: string | null
          name?: string | null
        }
        Update: {
          createdAt?: string | null
          id?: string | null
          name?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          file_format: string
          id: string
          milestone_id: string
          order_index: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_format: string
          id?: string
          milestone_id: string
          order_index?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_format?: string
          id?: string
          milestone_id?: string
          order_index?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatarURL: string | null
          createdAt: string | null
          email: string | null
          fullName: string | null
          id: string
          role: Database["public"]["Enums"]["roles"]
        }
        Insert: {
          avatarURL?: string | null
          createdAt?: string | null
          email?: string | null
          fullName?: string | null
          id: string
          role?: Database["public"]["Enums"]["roles"]
        }
        Update: {
          avatarURL?: string | null
          createdAt?: string | null
          email?: string | null
          fullName?: string | null
          id?: string
          role?: Database["public"]["Enums"]["roles"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_milestone: {
        Args: { p_milestone_id: string }
        Returns: undefined
      }
      assign_project: {
        Args: {
          p_assigned_by?: string
          p_project_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      complete_milestone: {
        Args: { p_milestone_id: string }
        Returns: undefined
      }
      create_milestone: {
        Args: {
          p_description?: string
          p_end_date?: string
          p_end_time?: string
          p_manager_id?: string
          p_priority?: Database["public"]["Enums"]["milestone_priority"]
          p_project_id: string
          p_start_date?: string
          p_start_time?: string
          p_title: string
        }
        Returns: undefined
      }
      is_admin_or_manager: { Args: never; Returns: boolean }
      release_project: { Args: { p_project_id: string }; Returns: undefined }
    }
    Enums: {
      milestone_priority: "low" | "normal" | "high"
      milestone_status: "pending" | "active" | "completed"
      project_status:
        | "reserved"
        | "claimed"
        | "receipt"
        | "in_progress"
        | "declined"
        | "completed"
      roles: "admin" | "super_admin" | "onterpeoner"
      task_status: "todo" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      milestone_priority: ["low", "normal", "high"],
      milestone_status: ["pending", "active", "completed"],
      project_status: [
        "reserved",
        "claimed",
        "receipt",
        "in_progress",
        "declined",
        "completed",
      ],
      roles: ["admin", "super_admin", "onterpeoner"],
      task_status: ["todo", "in_progress", "completed"],
    },
  },
} as const
