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
      trade_analytics: {
        Row: {
          average_trade_duration: unknown | null
          best_trade_pnl: number | null
          created_at: string
          favorite_pair_id: string | null
          id: string
          last_calculated_at: string
          total_pnl: number
          total_trades: number
          total_volume: number
          updated_at: string
          user_id: string
          winning_trades: number
          worst_trade_pnl: number | null
        }
        Insert: {
          average_trade_duration?: unknown | null
          best_trade_pnl?: number | null
          created_at?: string
          favorite_pair_id?: string | null
          id?: string
          last_calculated_at: string
          total_pnl?: number
          total_trades?: number
          total_volume?: number
          updated_at?: string
          user_id: string
          winning_trades?: number
          worst_trade_pnl?: number | null
        }
        Update: {
          average_trade_duration?: unknown | null
          best_trade_pnl?: number | null
          created_at?: string
          favorite_pair_id?: string | null
          id?: string
          last_calculated_at?: string
          total_pnl?: number
          total_trades?: number
          total_volume?: number
          updated_at?: string
          user_id?: string
          winning_trades?: number
          worst_trade_pnl?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_analytics_favorite_pair_id_fkey"
            columns: ["favorite_pair_id"]
            isOneToOne: false
            referencedRelation: "trading_pairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_positions: {
        Row: {
          closed_at: string | null
          created_at: string
          current_price: number
          entry_price: number
          id: string
          opened_at: string
          pair_id: string
          quantity: number
          realized_pnl: number | null
          side: string
          status: string
          unrealized_pnl: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          current_price: number
          entry_price: number
          id?: string
          opened_at: string
          pair_id: string
          quantity: number
          realized_pnl?: number | null
          side: string
          status: string
          unrealized_pnl?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          current_price?: number
          entry_price?: number
          id?: string
          opened_at?: string
          pair_id?: string
          quantity?: number
          realized_pnl?: number | null
          side?: string
          status?: string
          unrealized_pnl?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_positions_pair_id_fkey"
            columns: ["pair_id"]
            isOneToOne: false
            referencedRelation: "trading_pairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_positions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          closed_at: string | null
          created_at: string
          executed_at: string
          fee: number
          fee_asset: string
          id: string
          order_type: string
          pair_id: string
          price: number
          profit_loss: number | null
          quantity: number
          side: string
          status: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          executed_at: string
          fee?: number
          fee_asset: string
          id?: string
          order_type: string
          pair_id: string
          price: number
          profit_loss?: number | null
          quantity: number
          side: string
          status: string
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          executed_at?: string
          fee?: number
          fee_asset?: string
          id?: string
          order_type?: string
          pair_id?: string
          price?: number
          profit_loss?: number | null
          quantity?: number
          side?: string
          status?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_pair_id_fkey"
            columns: ["pair_id"]
            isOneToOne: false
            referencedRelation: "trading_pairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_pairs: {
        Row: {
          base_asset: string
          created_at: string
          exchange: string
          id: string
          is_active: boolean | null
          quote_asset: string
          symbol: string
          updated_at: string
        }
        Insert: {
          base_asset: string
          created_at?: string
          exchange: string
          id?: string
          is_active?: boolean | null
          quote_asset: string
          symbol: string
          updated_at?: string
        }
        Update: {
          base_asset?: string
          created_at?: string
          exchange?: string
          id?: string
          is_active?: boolean | null
          quote_asset?: string
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      User: {
        Row: {
          created_at: string
          display_name: string
          id: string
          thumbnail_img: string | null
          updated_at: string
          username: string
          wallet_address: string | null
          wallet_type: string | null
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          thumbnail_img?: string | null
          updated_at?: string
          username: string
          wallet_address?: string | null
          wallet_type?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          thumbnail_img?: string | null
          updated_at?: string
          username?: string
          wallet_address?: string | null
          wallet_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_highest_win_rates: {
        Args: {
          limit_count?: number
        }
        Returns: {
          user_id: string
          username: string
          display_name: string
          thumbnail_img: string
          win_rate: number
          total_trades: number
        }[]
      }
      get_most_traded_tokens: {
        Args: {
          limit_count?: number
        }
        Returns: {
          symbol: string
          exchange: string
          total_trades: number
          total_volume: number
        }[]
      }
      get_trader_stats: {
        Args: {
          time_range?: unknown
          limit_count?: number
        }
        Returns: {
          user_id: string
          total_trades: number
          winning_trades: number
          total_volume: number
          total_pnl: number
          favorite_pair_id: string
          win_rate: number
        }[]
      }
      get_trading_activity: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_trades: number
          total_volume: number
          active_traders: number
          avg_trade_size: number
        }[]
      }
      random_between: {
        Args: {
          low: number
          high: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
