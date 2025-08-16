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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          read: boolean | null
          related_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          read?: boolean | null
          related_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          notification_type?: Database["public"]["Enums"]["notification_type"]
          read?: boolean | null
          related_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payment_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          contact_info: string | null
          contact_method: string | null
          created_at: string
          id: string
          payment_screenshot_url: string | null
          product_id: string
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          contact_info?: string | null
          contact_method?: string | null
          created_at?: string
          id?: string
          payment_screenshot_url?: string | null
          product_id: string
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          contact_info?: string | null
          contact_method?: string | null
          created_at?: string
          id?: string
          payment_screenshot_url?: string | null
          product_id?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "payment_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      products: {
        Row: {
          bucket_name: string
          created_at: string
          created_by: string | null
          description: string | null
          downloads_count: number | null
          file_paths: string[] | null
          id: string
          images: string[] | null
          metadata: Json | null
          price: number | null
          product_type: Database["public"]["Enums"]["product_type"]
          title: string
          updated_at: string
        }
        Insert: {
          bucket_name: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          downloads_count?: number | null
          file_paths?: string[] | null
          id?: string
          images?: string[] | null
          metadata?: Json | null
          price?: number | null
          product_type?: Database["public"]["Enums"]["product_type"]
          title: string
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          downloads_count?: number | null
          file_paths?: string[] | null
          id?: string
          images?: string[] | null
          metadata?: Json | null
          price?: number | null
          product_type?: Database["public"]["Enums"]["product_type"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          facebook_link: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          telegram_link: string | null
          updated_at: string
          user_id: string
          whatsapp_link: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          facebook_link?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          telegram_link?: string | null
          updated_at?: string
          user_id: string
          whatsapp_link?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          facebook_link?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          telegram_link?: string | null
          updated_at?: string
          user_id?: string
          whatsapp_link?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_by: string
          assigned_to: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_downloads: {
        Row: {
          downloaded_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          downloaded_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_downloads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      notification_type:
        | "request_approved"
        | "request_rejected"
        | "task_assigned"
        | "product_upload"
      product_type: "free" | "paid"
      request_status: "pending" | "approved" | "rejected"
      user_role: "super_admin" | "admin" | "user"
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
      notification_type: [
        "request_approved",
        "request_rejected",
        "task_assigned",
        "product_upload",
      ],
      product_type: ["free", "paid"],
      request_status: ["pending", "approved", "rejected"],
      user_role: ["super_admin", "admin", "user"],
    },
  },
} as const
