import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    created_at?: string;
                };
            };
            projects: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    start_date: string;
                    status: 'active' | 'discontinued';
                    discontinued_date: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    start_date: string;
                    status?: 'active' | 'discontinued';
                    discontinued_date?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    start_date?: string;
                    status?: 'active' | 'discontinued';
                    discontinued_date?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            invoice_periods: {
                Row: {
                    id: string;
                    user_id: string;
                    period_start: string;
                    period_end: string;
                    cutoff_type: 'first_half' | 'second_half';
                    generated_at: string;
                    total_amount: number;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    period_start: string;
                    period_end: string;
                    cutoff_type: 'first_half' | 'second_half';
                    generated_at?: string;
                    total_amount: number;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    period_start?: string;
                    period_end?: string;
                    cutoff_type?: 'first_half' | 'second_half';
                    generated_at?: string;
                    total_amount?: number;
                };
            };
            invoice_items: {
                Row: {
                    id: string;
                    invoice_period_id: string;
                    project_id: string;
                    working_days: number;
                    working_hours: number;
                    rate_type: 'first_project' | 'second_project';
                    regular_pay: number;
                    is_discontinued: boolean;
                    discontinued_payment: number | null;
                };
                Insert: {
                    id?: string;
                    invoice_period_id: string;
                    project_id: string;
                    working_days: number;
                    working_hours: number;
                    rate_type: 'first_project' | 'second_project';
                    regular_pay: number;
                    is_discontinued?: boolean;
                    discontinued_payment?: number | null;
                };
                Update: {
                    id?: string;
                    invoice_period_id?: string;
                    project_id?: string;
                    working_days?: number;
                    working_hours?: number;
                    rate_type?: 'first_project' | 'second_project';
                    regular_pay?: number;
                    is_discontinued?: boolean;
                    discontinued_payment?: number | null;
                };
            };
            invoice_adjustments: {
                Row: {
                    id: string;
                    invoice_period_id: string;
                    type: 'overtime' | 'reimbursement';
                    description: string;
                    amount: number;
                    hours: number | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    invoice_period_id: string;
                    type: 'overtime' | 'reimbursement';
                    description: string;
                    amount: number;
                    hours?: number | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    invoice_period_id?: string;
                    type?: 'overtime' | 'reimbursement';
                    description?: string;
                    amount?: number;
                    hours?: number | null;
                    created_at?: string;
                };
            };
        };
    };
}
