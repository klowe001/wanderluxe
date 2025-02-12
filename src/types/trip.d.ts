
export interface DayActivity {
  id: string;
  day_id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  cost: number | null;
  currency: string;
  order_index: number;
  created_at: string;
}

export interface ActivityFormData {
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  cost: number | null;
  currency: string;
}

export interface ActivityData {
  text: string;
  cost: string;
  currency: string;
}

// Updated to match the database schema
export interface HotelStay {
  stay_id: string;
  trip_id: string;
  hotel: string;
  hotel_details?: string;
  hotel_url?: string;
  hotel_checkin_date: string;
  hotel_checkout_date: string;
  cost: number | null;
  currency: string;
  hotel_address?: string;
  hotel_phone?: string;
  hotel_place_id?: string;
  hotel_website?: string;
  created_at?: string;
}

export interface AccommodationData {
  stay_id: string;
  trip_id: string;
  cost: number | null;
  hotel: string;
  hotel_details: string;
  hotel_url?: string;
  hotel_checkin_date: string;
  hotel_checkout_date: string;
  currency: string;
  hotel_address?: string;
  hotel_phone?: string;
  hotel_place_id?: string;
  hotel_website?: string;
  expense_type?: string;
  expense_paid?: boolean;
  expense_date?: string;
  order_index?: number;
}

export interface ExpenseData {
  id: string;
  trip_id: string;
  cost: number | null;
  category: string;
  description: string;
  currency: string;
  is_paid?: boolean;
  created_at?: string;
}

