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
      downloads: {
        Row: {
          downloaded_at: string
          id: string
          sfx_id: string | null
          track_id: string | null
          user_id: string
        }
        Insert: {
          downloaded_at?: string
          id?: string
          sfx_id?: string | null
          track_id?: string | null
          user_id: string
        }
        Update: {
          downloaded_at?: string
          id?: string
          sfx_id?: string | null
          track_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "downloads_sfx_id_fkey"
            columns: ["sfx_id"]
            isOneToOne: false
            referencedRelation: "sound_effects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          sfx_id: string | null
          track_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          sfx_id?: string | null
          track_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          sfx_id?: string | null
          track_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_sfx_id_fkey"
            columns: ["sfx_id"]
            isOneToOne: false
            referencedRelation: "sound_effects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      music_emotion_covers: {
        Row: {
          cover_url: string
          created_at: string
          emotion: Database["public"]["Enums"]["music_emotion"]
          id: string
          updated_at: string
        }
        Insert: {
          cover_url: string
          created_at?: string
          emotion: Database["public"]["Enums"]["music_emotion"]
          id?: string
          updated_at?: string
        }
        Update: {
          cover_url?: string
          created_at?: string
          emotion?: Database["public"]["Enums"]["music_emotion"]
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      music_tracks: {
        Row: {
          cover_image_url: string | null
          created_at: string
          download_count: number | null
          duration_seconds: number
          emotion: Database["public"]["Enums"]["music_emotion"]
          file_url: string
          id: string
          is_active: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          download_count?: number | null
          duration_seconds: number
          emotion: Database["public"]["Enums"]["music_emotion"]
          file_url: string
          id?: string
          is_active?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          download_count?: number | null
          duration_seconds?: number
          emotion?: Database["public"]["Enums"]["music_emotion"]
          file_url?: string
          id?: string
          is_active?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      playlist_items: {
        Row: {
          created_at: string
          id: string
          playlist_id: string
          position: number
          sfx_id: string | null
          track_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          playlist_id: string
          position?: number
          sfx_id?: string | null
          track_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          playlist_id?: string
          position?: number
          sfx_id?: string | null
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "playlist_items_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_items_sfx_id_fkey"
            columns: ["sfx_id"]
            isOneToOne: false
            referencedRelation: "sound_effects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_items_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "music_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sfx_style_covers: {
        Row: {
          cover_url: string
          created_at: string
          id: string
          style: Database["public"]["Enums"]["sfx_style"]
          updated_at: string
        }
        Insert: {
          cover_url: string
          created_at?: string
          id?: string
          style: Database["public"]["Enums"]["sfx_style"]
          updated_at?: string
        }
        Update: {
          cover_url?: string
          created_at?: string
          id?: string
          style?: Database["public"]["Enums"]["sfx_style"]
          updated_at?: string
        }
        Relationships: []
      }
      sound_effects: {
        Row: {
          created_at: string
          download_count: number | null
          duration_seconds: number
          file_url: string
          icon_url: string | null
          id: string
          is_active: boolean | null
          style: Database["public"]["Enums"]["sfx_style"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          download_count?: number | null
          duration_seconds: number
          file_url: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          style: Database["public"]["Enums"]["sfx_style"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          download_count?: number | null
          duration_seconds?: number
          file_url?: string
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          style?: Database["public"]["Enums"]["sfx_style"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
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
      has_active_subscription: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      music_emotion:
        | "alegre"
        | "triste"
        | "motivacional"
        | "suspense"
        | "curiosidade"
        | "tensao"
        | "epico"
        | "cinematografico"
        | "energetico"
        | "calmo"
        | "reflexivo"
        | "dramatico"
        | "moderno"
        | "minimalista"
        | "corporativo"
        | "animada"
        | "confianca"
        | "esperanca"
        | "felicidade"
        | "inveja"
        | "mix"
        | "superacao"
        | "vibes"
        | "bonus"
        | "cortes"
      sfx_style:
        | "whooshes"
        | "impacts"
        | "clicks"
        | "glitches"
        | "interface"
        | "natureza"
        | "ambiente"
        | "explosoes"
        | "cinematograficos"
        | "tecnologicos"
        | "agua"
        | "ambience"
        | "ambient_sounds"
        | "animais"
        | "atmosfera"
        | "birds"
        | "camera"
        | "carros"
        | "city_sounds"
        | "comicos"
        | "dinheiro"
        | "earth_destruction"
        | "fastcuts"
        | "fogo"
        | "foleys"
        | "gear"
        | "guns"
        | "hits"
        | "human"
        | "intuicao"
        | "metro"
        | "moments"
        | "movimento"
        | "objects_of_desire"
        | "organico"
        | "radio_voice"
        | "riser"
        | "scratch"
        | "slow_motion"
        | "special"
        | "speedramping"
        | "swoosh"
        | "torque"
        | "transition_sounds"
        | "trem"
        | "whizz"
        | "wind_lightning"
        | "writing"
      subscription_status: "active" | "cancelled" | "expired" | "pending"
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
      app_role: ["admin", "moderator", "user"],
      music_emotion: [
        "alegre",
        "triste",
        "motivacional",
        "suspense",
        "curiosidade",
        "tensao",
        "epico",
        "cinematografico",
        "energetico",
        "calmo",
        "reflexivo",
        "dramatico",
        "moderno",
        "minimalista",
        "corporativo",
        "animada",
        "confianca",
        "esperanca",
        "felicidade",
        "inveja",
        "mix",
        "superacao",
        "vibes",
        "bonus",
        "cortes",
      ],
      sfx_style: [
        "whooshes",
        "impacts",
        "clicks",
        "glitches",
        "interface",
        "natureza",
        "ambiente",
        "explosoes",
        "cinematograficos",
        "tecnologicos",
        "agua",
        "ambience",
        "ambient_sounds",
        "animais",
        "atmosfera",
        "birds",
        "camera",
        "carros",
        "city_sounds",
        "comicos",
        "dinheiro",
        "earth_destruction",
        "fastcuts",
        "fogo",
        "foleys",
        "gear",
        "guns",
        "hits",
        "human",
        "intuicao",
        "metro",
        "moments",
        "movimento",
        "objects_of_desire",
        "organico",
        "radio_voice",
        "riser",
        "scratch",
        "slow_motion",
        "special",
        "speedramping",
        "swoosh",
        "torque",
        "transition_sounds",
        "trem",
        "whizz",
        "wind_lightning",
        "writing",
      ],
      subscription_status: ["active", "cancelled", "expired", "pending"],
    },
  },
} as const
