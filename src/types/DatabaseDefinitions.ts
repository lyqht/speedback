export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      Ship: {
        Row: {
          id: string;
          created_at: string | null;
          captain: string;
          crew: Json[] | null;
          code: string | null;
          name: string | null;
        };
        Insert: {
          id: string;
          created_at?: string | null;
          captain?: string | null;
          crew?: Json[] | null;
          code?: string | null;
          name?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          captain?: string | null;
          crew?: Json[] | null;
          code?: string | null;
          name?: string | null;
        };
      };
      UserMetadata: {
        Row: {
          id: string;
          created_at: string | null;
          userId: string;
          avatarUrl: string | null;
        };
        Insert: {
          id: string;
          created_at?: string | null;
          userId: string;
          avatarUrl?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          userId?: string;
          avatarUrl?: string | null;
        };
      };
      Schedule: {
        Row: {
          id: number;
          created_at: string | null;
          shipId: string | null;
          sequence: Json | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          shipId?: string | null;
          sequence?: Json | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          shipId?: string | null;
          sequence?: Json | null;
        };
      };
    };
    Functions: {};
  };
}
