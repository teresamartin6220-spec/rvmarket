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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      financing_applications: {
        Row: {
          created_at: string
          down_payment: number | null
          email: string
          estimated_monthly: number | null
          id: string
          loan_term: number | null
          name: string
          phone: string | null
          rv_id: string | null
          rv_price: number | null
          rv_title: string | null
        }
        Insert: {
          created_at?: string
          down_payment?: number | null
          email: string
          estimated_monthly?: number | null
          id?: string
          loan_term?: number | null
          name: string
          phone?: string | null
          rv_id?: string | null
          rv_price?: number | null
          rv_title?: string | null
        }
        Update: {
          created_at?: string
          down_payment?: number | null
          email?: string
          estimated_monthly?: number | null
          id?: string
          loan_term?: number | null
          name?: string
          phone?: string | null
          rv_id?: string | null
          rv_price?: number | null
          rv_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financing_applications_rv_id_fkey"
            columns: ["rv_id"]
            isOneToOne: false
            referencedRelation: "rv_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          rv_id: string | null
          rv_title: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          rv_id?: string | null
          rv_title?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          rv_id?: string | null
          rv_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_rv_id_fkey"
            columns: ["rv_id"]
            isOneToOne: false
            referencedRelation: "rv_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          page: string
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page: string
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page?: string
          user_agent?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      rv_listings: {
        Row: {
          brand: string
          condition: string | null
          country: string | null
          created_at: string
          description: string | null
          features: Json | null
          id: string
          images: string[] | null
          is_sold: boolean | null
          is_super_special: boolean | null
          location: string | null
          mileage: number
          model: string
          price: number
          sleeps: number
          specs: Json | null
          stock_number: string | null
          title: string
          transmission: string | null
          type: string
          updated_at: string
          vin: string | null
          year: number
        }
        Insert: {
          brand: string
          condition?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          images?: string[] | null
          is_sold?: boolean | null
          is_super_special?: boolean | null
          location?: string | null
          mileage?: number
          model: string
          price?: number
          sleeps?: number
          specs?: Json | null
          stock_number?: string | null
          title: string
          transmission?: string | null
          type: string
          updated_at?: string
          vin?: string | null
          year?: number
        }
        Update: {
          brand?: string
          condition?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          images?: string[] | null
          is_sold?: boolean | null
          is_super_special?: boolean | null
          location?: string | null
          mileage?: number
          model?: string
          price?: number
          sleeps?: number
          specs?: Json | null
          stock_number?: string | null
          title?: string
          transmission?: string | null
          type?: string
          updated_at?: string
          vin?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
