export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_new: boolean | null
          link_to: string | null
          logo: string | null
          message: string
          notification_time: string
          source: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_new?: boolean | null
          link_to?: string | null
          logo?: string | null
          message: string
          notification_time: string
          source?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_new?: boolean | null
          link_to?: string | null
          logo?: string | null
          message?: string
          notification_time?: string
          source?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          cdl_number: string
          company_email_making_report: string | null
          company_name_making_report: string
          company_phone_making_report: string | null
          created_at: string
          date_occurred: string
          description: string
          driver_first_name: string | null
          driver_last_name: string | null
          id: string
          incident_type: Database["public"]["Enums"]["incident_type_enum"]
          location: string
          reporter_profile_id: string | null
          status: Database["public"]["Enums"]["report_status_enum"]
          updated_at: string
        }
        Insert: {
          cdl_number: string
          company_email_making_report?: string | null
          company_name_making_report: string
          company_phone_making_report?: string | null
          created_at?: string
          date_occurred: string
          description: string
          driver_first_name?: string | null
          driver_last_name?: string | null
          id?: string
          incident_type: Database["public"]["Enums"]["incident_type_enum"]
          location: string
          reporter_profile_id?: string | null
          status?: Database["public"]["Enums"]["report_status_enum"]
          updated_at?: string
        }
        Update: {
          cdl_number?: string
          company_email_making_report?: string | null
          company_name_making_report?: string
          company_phone_making_report?: string | null
          created_at?: string
          date_occurred?: string
          description?: string
          driver_first_name?: string | null
          driver_last_name?: string | null
          id?: string
          incident_type?: Database["public"]["Enums"]["incident_type_enum"]
          location?: string
          reporter_profile_id?: string | null
          status?: Database["public"]["Enums"]["report_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_profile_id_fkey"
            columns: ["reporter_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_company_name: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      incident_type_enum:
        | "aggressive_driving"
        | "reckless_driving"
        | "road_rage"
        | "unsafe_lane_change"
        | "speeding"
        | "tailgating"
        | "distracted_driving"
        | "failure_to_signal"
        | "blocking_traffic"
        | "employment_defaults"
        | "safety_violations"
        | "theft_criminal_activities"
        | "professional_misconduct"
        | "other"
      report_status_enum: "Pending" | "Reviewed" | "Resolved" | "Rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      incident_type_enum: [
        "aggressive_driving",
        "reckless_driving",
        "road_rage",
        "unsafe_lane_change",
        "speeding",
        "tailgating",
        "distracted_driving",
        "failure_to_signal",
        "blocking_traffic",
        "employment_defaults",
        "safety_violations",
        "theft_criminal_activities",
        "professional_misconduct",
        "other",
      ],
      report_status_enum: ["Pending", "Reviewed", "Resolved", "Rejected"],
    },
  },
} as const
