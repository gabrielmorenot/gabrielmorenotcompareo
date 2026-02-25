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
      banners: {
        Row: {
          active: boolean
          button_link: string | null
          button_text: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string | null
          mobile_image_url: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          mobile_image_url?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          button_link?: string | null
          button_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          mobile_image_url?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      hero_promos: {
        Row: {
          active: boolean
          autoplay_interval: number | null
          banner_size: string
          created_at: string
          desktop_image_url: string
          display_order: number | null
          id: string
          link: string | null
          mobile_image_url: string | null
          show_on_mobile: boolean
          updated_at: string
        }
        Insert: {
          active?: boolean
          autoplay_interval?: number | null
          banner_size?: string
          created_at?: string
          desktop_image_url: string
          display_order?: number | null
          id?: string
          link?: string | null
          mobile_image_url?: string | null
          show_on_mobile?: boolean
          updated_at?: string
        }
        Update: {
          active?: boolean
          autoplay_interval?: number | null
          banner_size?: string
          created_at?: string
          desktop_image_url?: string
          display_order?: number | null
          id?: string
          link?: string | null
          mobile_image_url?: string | null
          show_on_mobile?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          active: boolean
          created_at: string
          display_order: number | null
          id: string
          is_external: boolean
          label: string
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_order?: number | null
          id?: string
          is_external?: boolean
          label: string
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_order?: number | null
          id?: string
          is_external?: boolean
          label?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          active: boolean
          affiliate_link: string
          category: Database["public"]["Enums"]["product_category"]
          category_id: string | null
          created_at: string
          discount: number | null
          id: string
          image_url: string | null
          is_daily_offer: boolean
          name: string
          price: number
          store_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          affiliate_link: string
          category: Database["public"]["Enums"]["product_category"]
          category_id?: string | null
          created_at?: string
          discount?: number | null
          id?: string
          image_url?: string | null
          is_daily_offer?: boolean
          name: string
          price: number
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          affiliate_link?: string
          category?: Database["public"]["Enums"]["product_category"]
          category_id?: string | null
          created_at?: string
          discount?: number | null
          id?: string
          image_url?: string | null
          is_daily_offer?: boolean
          name?: string
          price?: number
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      popups: {
        Row: {
          active: boolean
          created_at: string
          cta_link: string | null
          cta_text: string | null
          delay_seconds: number
          description: string | null
          device_target: Database["public"]["Enums"]["popup_device_target"]
          display_order: number | null
          display_target: Database["public"]["Enums"]["popup_display_target"]
          id: string
          image_url: string | null
          once_per_session: boolean
          popup_type: Database["public"]["Enums"]["popup_type"]
          specific_pages: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          delay_seconds?: number
          description?: string | null
          device_target?: Database["public"]["Enums"]["popup_device_target"]
          display_order?: number | null
          display_target?: Database["public"]["Enums"]["popup_display_target"]
          id?: string
          image_url?: string | null
          once_per_session?: boolean
          popup_type?: Database["public"]["Enums"]["popup_type"]
          specific_pages?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          delay_seconds?: number
          description?: string | null
          device_target?: Database["public"]["Enums"]["popup_device_target"]
          display_order?: number | null
          display_target?: Database["public"]["Enums"]["popup_display_target"]
          id?: string
          image_url?: string | null
          once_per_session?: boolean
          popup_type?: Database["public"]["Enums"]["popup_type"]
          specific_pages?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      stores: {
        Row: {
          active: boolean
          created_at: string
          id: string
          link: string | null
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          link?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          link?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      popup_device_target: "desktop" | "mobile" | "both"
      popup_display_target: "home" | "all" | "specific"
      popup_type: "informativo" | "promocao" | "captura_lead"
      product_category:
        | "tv"
        | "celular"
        | "geladeira"
        | "ar-condicionado"
        | "lavadora"
        | "notebook"
        | "fogao"
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
      app_role: ["admin", "user"],
      popup_device_target: ["desktop", "mobile", "both"],
      popup_display_target: ["home", "all", "specific"],
      popup_type: ["informativo", "promocao", "captura_lead"],
      product_category: [
        "tv",
        "celular",
        "geladeira",
        "ar-condicionado",
        "lavadora",
        "notebook",
        "fogao",
      ],
    },
  },
} as const
