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
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content_da: string
          content_en: string
          cover_image: string | null
          created_at: string
          excerpt_da: string | null
          excerpt_en: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          title_da: string
          title_en: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content_da: string
          content_en: string
          cover_image?: string | null
          created_at?: string
          excerpt_da?: string | null
          excerpt_en?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          title_da: string
          title_en: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content_da?: string
          content_en?: string
          cover_image?: string | null
          created_at?: string
          excerpt_da?: string | null
          excerpt_en?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          title_da?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          block_key: string
          color: string | null
          created_at: string
          description_da: string | null
          description_en: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          metadata: Json | null
          published_at: string | null
          section: string
          sort_order: number
          status: string
          title_da: string | null
          title_en: string | null
          updated_at: string
          value: string | null
        }
        Insert: {
          block_key: string
          color?: string | null
          created_at?: string
          description_da?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          metadata?: Json | null
          published_at?: string | null
          section: string
          sort_order?: number
          status?: string
          title_da?: string | null
          title_en?: string | null
          updated_at?: string
          value?: string | null
        }
        Update: {
          block_key?: string
          color?: string | null
          created_at?: string
          description_da?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          metadata?: Json | null
          published_at?: string | null
          section?: string
          sort_order?: number
          status?: string
          title_da?: string | null
          title_en?: string | null
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_da: string
          answer_en: string
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          question_da: string
          question_en: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer_da: string
          answer_en: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          question_da: string
          question_en: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer_da?: string
          answer_en?: string
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          question_da?: string
          question_en?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      feedback_tickets: {
        Row: {
          id: string
          type: string
          priority: string
          status: string
          title: string
          description: string
          submitted_from_url: string | null
          screenshot_url: string | null
          submitted_by: string | null
          admin_notes: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          priority?: string
          status?: string
          title: string
          description: string
          submitted_from_url?: string | null
          screenshot_url?: string | null
          submitted_by?: string | null
          admin_notes?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          priority?: string
          status?: string
          title?: string
          description?: string
          submitted_from_url?: string | null
          screenshot_url?: string | null
          submitted_by?: string | null
          admin_notes?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      office_locations: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          flag: string | null
          id: string
          is_active: boolean
          lat: number | null
          lng: number | null
          name_da: string
          name_en: string
          sort_order: number
          type: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          flag?: string | null
          id?: string
          is_active?: boolean
          lat?: number | null
          lng?: number | null
          name_da: string
          name_en: string
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          flag?: string | null
          id?: string
          is_active?: boolean
          lat?: number | null
          lng?: number | null
          name_da?: string
          name_en?: string
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          id: string
          name_da: string
          name_en: string
        }
        Insert: {
          created_at?: string
          id: string
          name_da: string
          name_en: string
        }
        Update: {
          created_at?: string
          id?: string
          name_da?: string
          name_en?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string
          created_at: string
          description_da: string
          description_en: string
          featured: boolean | null
          gallery: Json | null
          id: string
          image_url: string
          is_active: boolean | null
          name_da: string
          name_en: string
          slug: string
          sort_order: number | null
          spec_material: string | null
          spec_size: string | null
          spec_weight: string | null
          updated_at: string
          use_cases_da: Json | null
          use_cases_en: Json | null
        }
        Insert: {
          category_id: string
          created_at?: string
          description_da: string
          description_en: string
          featured?: boolean | null
          gallery?: Json | null
          id?: string
          image_url: string
          is_active?: boolean | null
          name_da: string
          name_en: string
          slug: string
          sort_order?: number | null
          spec_material?: string | null
          spec_size?: string | null
          spec_weight?: string | null
          updated_at?: string
          use_cases_da?: Json | null
          use_cases_en?: Json | null
        }
        Update: {
          category_id?: string
          created_at?: string
          description_da?: string
          description_en?: string
          featured?: boolean | null
          gallery?: Json | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          name_da?: string
          name_en?: string
          slug?: string
          sort_order?: number | null
          spec_material?: string | null
          spec_size?: string | null
          spec_weight?: string | null
          updated_at?: string
          use_cases_da?: Json | null
          use_cases_en?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotation_requests: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          product_id: string | null
          quantity: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          product_id?: string | null
          quantity?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          product_id?: string | null
          quantity?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotation_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          contact_address: string | null
          contact_email: string | null
          contact_phone: string | null
          cvr_number: string | null
          footer_text_da: string | null
          footer_text_en: string | null
          hero_variant: string
          id: string
          logo_url: string | null
          map_embed_url: string | null
          map_latitude: string | null
          map_longitude: string | null
          site_tagline_da: string | null
          site_tagline_en: string | null
          site_title_da: string | null
          site_title_en: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_twitter: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cvr_number?: string | null
          footer_text_da?: string | null
          footer_text_en?: string | null
          hero_variant?: string
          id?: string
          logo_url?: string | null
          map_embed_url?: string | null
          map_latitude?: string | null
          map_longitude?: string | null
          site_tagline_da?: string | null
          site_tagline_en?: string | null
          site_title_da?: string | null
          site_title_en?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          contact_address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          cvr_number?: string | null
          footer_text_da?: string | null
          footer_text_en?: string | null
          hero_variant?: string
          id?: string
          logo_url?: string | null
          map_embed_url?: string | null
          map_latitude?: string | null
          map_longitude?: string | null
          site_tagline_da?: string | null
          site_tagline_en?: string | null
          site_title_da?: string | null
          site_title_en?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_twitter?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio_da: string | null
          bio_en: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          role_da: string
          role_en: string
          sort_order: number
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          bio_da?: string | null
          bio_en?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          role_da: string
          role_en: string
          sort_order?: number
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          bio_da?: string | null
          bio_en?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          role_da?: string
          role_en?: string
          sort_order?: number
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          company: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          rating: number
          role: string | null
          sort_order: number
          text_da: string
          text_en: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          rating?: number
          role?: string | null
          sort_order?: number
          text_da: string
          text_en: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          rating?: number
          role?: string | null
          sort_order?: number
          text_da?: string
          text_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          color: string | null
          created_at: string
          description_da: string | null
          description_en: string | null
          id: string
          is_active: boolean
          sort_order: number
          title_da: string
          title_en: string
          updated_at: string
          year: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description_da?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          title_da: string
          title_en: string
          updated_at?: string
          year: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description_da?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          title_da?: string
          title_en?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          key: string
          updated_at: string
          value_da: string
          value_en: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          updated_at?: string
          value_da: string
          value_en: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          updated_at?: string
          value_da?: string
          value_en?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
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
      app_role: ["admin", "editor"],
    },
  },
} as const
