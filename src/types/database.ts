export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      credits: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          updated_at?: string;
        };
        Update: {
          balance?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "credits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      restorations: {
        Row: {
          id: string;
          user_id: string | null;
          original_url: string;
          restored_url: string | null;
          status: "pending" | "processing" | "completed" | "failed";
          error_msg: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          original_url: string;
          restored_url?: string | null;
          status?: "pending" | "processing" | "completed" | "failed";
          error_msg?: string | null;
          created_at?: string;
        };
        Update: {
          restored_url?: string | null;
          status?: "pending" | "processing" | "completed" | "failed";
          error_msg?: string | null;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          credits_amount: number;
          is_active: boolean;
          used_by: string | null;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          credits_amount: number;
          is_active?: boolean;
          used_by?: string | null;
          used_at?: string | null;
          created_at?: string;
        };
        Update: {
          is_active?: boolean;
          used_by?: string | null;
          used_at?: string | null;
        };
        Relationships: [];
      };
      stripe_events: {
        Row: {
          id: string;
          processed_at: string;
        };
        Insert: {
          id: string;
          processed_at?: string;
        };
        Update: {
          processed_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      consume_credits: {
        Args: { p_user_id: string; p_amount: number };
        Returns: undefined;
      };
      add_credits: {
        Args: { p_user_id: string; p_amount: number };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Credits = Database["public"]["Tables"]["credits"]["Row"];
export type Restoration = Database["public"]["Tables"]["restorations"]["Row"];
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
export type StripeEvent = Database["public"]["Tables"]["stripe_events"]["Row"];
