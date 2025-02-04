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
      activities: {
        Row: {
          cost: number | null
          created_at: string
          currency: string | null
          event_id: string
          id: string
          text: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          currency?: string | null
          event_id: string
          id?: string
          text: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          currency?: string | null
          event_id?: string
          id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
        ]
      }
      day_activities: {
        Row: {
          cost: number | null
          created_at: string
          currency: string | null
          day_id: string
          description: string | null
          end_time: string | null
          id: string
          order_index: number
          start_time: string | null
          title: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          currency?: string | null
          day_id: string
          description?: string | null
          end_time?: string | null
          id?: string
          order_index: number
          start_time?: string | null
          title: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          currency?: string | null
          day_id?: string
          description?: string | null
          end_time?: string | null
          id?: string
          order_index?: number
          start_time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "day_activities_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "trip_days"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rates: {
        Row: {
          currency_from: string
          currency_to: string
          id: string
          last_updated: string | null
          rate: number
        }
        Insert: {
          currency_from: string
          currency_to: string
          id?: string
          last_updated?: string | null
          rate: number
        }
        Update: {
          currency_from?: string
          currency_to?: string
          id?: string
          last_updated?: string | null
          rate?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          home_location: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          home_location?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          home_location?: string | null
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      restaurant_reservations: {
        Row: {
          address: string | null
          confirmation_number: string | null
          cost: number | null
          created_at: string
          currency: string | null
          day_id: string
          id: string
          notes: string | null
          number_of_people: number | null
          order_index: number
          phone_number: string | null
          place_id: string | null
          rating: number | null
          reservation_time: string | null
          restaurant_name: string
          website: string | null
        }
        Insert: {
          address?: string | null
          confirmation_number?: string | null
          cost?: number | null
          created_at?: string
          currency?: string | null
          day_id: string
          id?: string
          notes?: string | null
          number_of_people?: number | null
          order_index: number
          phone_number?: string | null
          place_id?: string | null
          rating?: number | null
          reservation_time?: string | null
          restaurant_name: string
          website?: string | null
        }
        Update: {
          address?: string | null
          confirmation_number?: string | null
          cost?: number | null
          created_at?: string
          currency?: string | null
          day_id?: string
          id?: string
          notes?: string | null
          number_of_people?: number | null
          order_index?: number
          phone_number?: string | null
          place_id?: string | null
          rating?: number | null
          reservation_time?: string | null
          restaurant_name?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_reservations_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "trip_days"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          accommodation_group_id: string | null
          created_at: string
          date: string
          description: string | null
          expense_cost: number | null
          expense_currency: string | null
          expense_date: string | null
          expense_paid: boolean | null
          expense_type: string | null
          final_accommodation_day: string | null
          hotel: string | null
          hotel_address: string | null
          hotel_checkin_date: string | null
          hotel_checkout_date: string | null
          hotel_details: string | null
          hotel_phone: string | null
          hotel_place_id: string | null
          hotel_url: string | null
          hotel_website: string | null
          id: string
          image_url: string | null
          order_index: number
          title: string
          trip_id: string
        }
        Insert: {
          accommodation_group_id?: string | null
          created_at?: string
          date: string
          description?: string | null
          expense_cost?: number | null
          expense_currency?: string | null
          expense_date?: string | null
          expense_paid?: boolean | null
          expense_type?: string | null
          final_accommodation_day?: string | null
          hotel?: string | null
          hotel_address?: string | null
          hotel_checkin_date?: string | null
          hotel_checkout_date?: string | null
          hotel_details?: string | null
          hotel_phone?: string | null
          hotel_place_id?: string | null
          hotel_url?: string | null
          hotel_website?: string | null
          id?: string
          image_url?: string | null
          order_index: number
          title: string
          trip_id: string
        }
        Update: {
          accommodation_group_id?: string | null
          created_at?: string
          date?: string
          description?: string | null
          expense_cost?: number | null
          expense_currency?: string | null
          expense_date?: string | null
          expense_paid?: boolean | null
          expense_type?: string | null
          final_accommodation_day?: string | null
          hotel?: string | null
          hotel_address?: string | null
          hotel_checkin_date?: string | null
          hotel_checkout_date?: string | null
          hotel_details?: string | null
          hotel_phone?: string | null
          hotel_place_id?: string | null
          hotel_url?: string | null
          hotel_website?: string | null
          id?: string
          image_url?: string | null
          order_index?: number
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_accommodation_group_id_fkey"
            columns: ["accommodation_group_id"]
            isOneToOne: false
            referencedRelation: "timeline_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timeline_events_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      transportation_events: {
        Row: {
          arrival_location: string | null
          confirmation_number: string | null
          cost: number | null
          created_at: string
          currency: string | null
          departure_location: string | null
          details: string | null
          end_date: string | null
          end_time: string | null
          id: string
          is_arrival: boolean | null
          is_departure: boolean | null
          provider: string | null
          start_date: string
          start_time: string | null
          trip_id: string
          type: Database["public"]["Enums"]["transportation_type"]
        }
        Insert: {
          arrival_location?: string | null
          confirmation_number?: string | null
          cost?: number | null
          created_at?: string
          currency?: string | null
          departure_location?: string | null
          details?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          is_arrival?: boolean | null
          is_departure?: boolean | null
          provider?: string | null
          start_date: string
          start_time?: string | null
          trip_id: string
          type: Database["public"]["Enums"]["transportation_type"]
        }
        Update: {
          arrival_location?: string | null
          confirmation_number?: string | null
          cost?: number | null
          created_at?: string
          currency?: string | null
          departure_location?: string | null
          details?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          is_arrival?: boolean | null
          is_departure?: boolean | null
          provider?: string | null
          start_date?: string
          start_time?: string | null
          trip_id?: string
          type?: Database["public"]["Enums"]["transportation_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transportation_events_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_days: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          image_url: string | null
          title: string | null
          trip_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string | null
          trip_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_days_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          arrival_date: string | null
          cover_image_url: string | null
          created_at: string
          departure_date: string | null
          destination: string
          end_date: string
          hidden: boolean | null
          id: string
          start_date: string
          user_id: string
        }
        Insert: {
          arrival_date?: string | null
          cover_image_url?: string | null
          created_at?: string
          departure_date?: string | null
          destination: string
          end_date: string
          hidden?: boolean | null
          id?: string
          start_date: string
          user_id: string
        }
        Update: {
          arrival_date?: string | null
          cover_image_url?: string | null
          created_at?: string
          departure_date?: string | null
          destination?: string
          end_date?: string
          hidden?: boolean | null
          id?: string
          start_date?: string
          user_id?: string
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
      transportation_type:
        | "flight"
        | "train"
        | "car_service"
        | "shuttle"
        | "ferry"
        | "rental_car"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
