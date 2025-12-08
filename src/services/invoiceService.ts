import { supabase } from '../lib/supabase';
import { Project } from './projectService';
import { isBefore, endOfDay } from 'date-fns';
import {
    PeriodInfo,
    calculateWorkingDays,
    getEffectiveStartDate,
    getEffectiveEndDate,
    calculateDailyRate,
    calculateHourlyRate,
} from '../utils/invoiceCalculations';

export interface InvoicePeriod {
    id: string;
    user_id: string;
    period_start: string;
    period_end: string;
    cutoff_type: 'first_half' | 'second_half';
    generated_at: string;
    total_amount: number;
}

export interface InvoiceItem {
    id: string;
    invoice_period_id: string;
    project_id: string;
    project_name?: string;
    working_days: number;
    working_hours: number;
    rate_type: 'first_project' | 'second_project';
    regular_pay: number;
    is_discontinued: boolean;
    discontinued_payment: number | null;
}

export interface InvoiceAdjustment {
    id: string;
    invoice_period_id: string;
    type: 'overtime' | 'reimbursement';
    description: string;
    amount: number;
    hours: number | null;
    created_at: string;
}

export interface InvoiceData {
    period: InvoicePeriod;
    items: InvoiceItem[];
    adjustments: InvoiceAdjustment[];
}

const FIRST_PROJECT_RATE = 20000;
const SECOND_PROJECT_RATE = 10000;

export const invoiceService = {
    /**
     * Generate invoice for a specific period
     */
    async generateInvoice(
        period: PeriodInfo,
        projects: Project[],
        overtimeHours: number = 0,
        reimbursements: Array<{ description: string; amount: number }> = []
    ): Promise<InvoiceData> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Calculate invoice items for each project
        const items: Omit<InvoiceItem, 'id' | 'invoice_period_id'>[] = [];
        let totalAmount = 0;

        // Cap the calculation end date to today if we are generating mid-period
        const today = endOfDay(new Date());
        const calculationEndDate = isBefore(today, period.end) ? today : period.end;

        projects.forEach((project, index) => {
            const effectiveStart = getEffectiveStartDate(project.start_date, period.start);
            const effectiveEnd = getEffectiveEndDate(
                project.status === 'discontinued' ? project.discontinued_date : null,
                calculationEndDate
            );

            const workingDays = calculateWorkingDays(effectiveStart, effectiveEnd);

            // Determine rate based on employment type and project order
            const isFirstProject = index === 0;
            const isPartTime = project.employment_type === 'part-time';

            let monthlyRate: number;
            let workingHours: number;

            if (isPartTime) {
                // Part-time projects always use ₱10,000 base rate
                monthlyRate = 10000;

                // Calculate hours based on part-time schedule
                const daysPerWeek = project.part_time_days_per_week || 5;
                const hoursPerDay = project.part_time_hours_per_day || 8;

                // Calculate actual working hours based on part-time schedule
                // Assuming 4.33 weeks per month on average
                const expectedMonthlyHours = daysPerWeek * hoursPerDay * 4.33;

                // Calculate pro-rated hours for the period
                workingHours = (workingDays / 22) * expectedMonthlyHours;
            } else {
                // Full-time: First project gets ₱20k, others get ₱10k
                monthlyRate = isFirstProject ? FIRST_PROJECT_RATE : SECOND_PROJECT_RATE;
                workingHours = workingDays * 8;
            }

            const dailyRate = calculateDailyRate(monthlyRate, period.start);
            const hourlyRate = calculateHourlyRate(dailyRate);

            let regularPay = hourlyRate * workingHours;
            let discontinuedPayment = null;

            // If project is discontinued, calculate 50% payment
            if (project.status === 'discontinued' && project.discontinued_date) {
                const fullPay = regularPay;
                discontinuedPayment = fullPay * 0.5;
                regularPay = discontinuedPayment;
            }

            items.push({
                project_id: project.id,
                project_name: project.name,
                working_days: workingDays,
                working_hours: workingHours,
                rate_type: isFirstProject ? 'first_project' : 'second_project',
                regular_pay: Math.round(regularPay * 100) / 100,
                is_discontinued: project.status === 'discontinued',
                discontinued_payment: discontinuedPayment ? Math.round(discontinuedPayment * 100) / 100 : null,
            });

            totalAmount += regularPay;
        });

        // Add overtime (only for first project)
        if (overtimeHours > 0 && projects.length > 0) {
            const dailyRate = calculateDailyRate(FIRST_PROJECT_RATE, period.start);
            const hourlyRate = calculateHourlyRate(dailyRate);
            const overtimePay = overtimeHours * hourlyRate;
            totalAmount += overtimePay;
        }

        // Add reimbursements
        reimbursements.forEach(r => {
            totalAmount += r.amount;
        });

        // Create invoice period
        const { data: invoicePeriod, error: periodError } = await supabase
            .from('invoice_periods')
            .insert({
                user_id: user.id,
                period_start: period.startStr,
                period_end: period.endStr,
                cutoff_type: period.type,
                total_amount: Math.round(totalAmount * 100) / 100,
            })
            .select()
            .single();

        if (periodError) throw periodError;

        // Create invoice items
        const itemsToInsert = items.map(item => ({
            ...item,
            invoice_period_id: invoicePeriod.id,
        }));

        const { data: createdItems, error: itemsError } = await supabase
            .from('invoice_items')
            .insert(itemsToInsert)
            .select();

        if (itemsError) throw itemsError;

        // Create adjustments
        const adjustments: InvoiceAdjustment[] = [];

        if (overtimeHours > 0 && projects.length > 0) {
            const dailyRate = calculateDailyRate(FIRST_PROJECT_RATE, period.start);
            const hourlyRate = calculateHourlyRate(dailyRate);
            const overtimePay = overtimeHours * hourlyRate;

            const { data: otAdjustment, error: otError } = await supabase
                .from('invoice_adjustments')
                .insert({
                    invoice_period_id: invoicePeriod.id,
                    type: 'overtime',
                    description: `Overtime (${overtimeHours} hours)`,
                    amount: Math.round(overtimePay * 100) / 100,
                    hours: overtimeHours,
                })
                .select()
                .single();

            if (otError) throw otError;
            adjustments.push(otAdjustment);
        }

        for (const reimbursement of reimbursements) {
            const { data: reimbursementAdjustment, error: reimbursementError } = await supabase
                .from('invoice_adjustments')
                .insert({
                    invoice_period_id: invoicePeriod.id,
                    type: 'reimbursement',
                    description: reimbursement.description,
                    amount: reimbursement.amount,
                })
                .select()
                .single();

            if (reimbursementError) throw reimbursementError;
            adjustments.push(reimbursementAdjustment);
        }

        return {
            period: invoicePeriod,
            items: createdItems,
            adjustments,
        };
    },

    /**
     * Get invoice history for current user
     */
    async getInvoiceHistory(): Promise<InvoiceData[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: periods, error: periodsError } = await supabase
            .from('invoice_periods')
            .select('*')
            .eq('user_id', user.id)
            .order('generated_at', { ascending: false });

        if (periodsError) throw periodsError;

        const invoices: InvoiceData[] = [];

        for (const period of periods || []) {
            const { data: items, error: itemsError } = await supabase
                .from('invoice_items')
                .select('*')
                .eq('invoice_period_id', period.id);

            if (itemsError) throw itemsError;

            const { data: adjustments, error: adjustmentsError } = await supabase
                .from('invoice_adjustments')
                .select('*')
                .eq('invoice_period_id', period.id);

            if (adjustmentsError) throw adjustmentsError;

            invoices.push({
                period,
                items: items || [],
                adjustments: adjustments || [],
            });
        }

        return invoices;
    },

    /**
     * Get a specific invoice by ID
     */
    async getInvoiceById(invoiceId: string): Promise<InvoiceData | null> {
        const { data: period, error: periodError } = await supabase
            .from('invoice_periods')
            .select('*')
            .eq('id', invoiceId)
            .single();

        if (periodError) return null;

        const { data: items, error: itemsError } = await supabase
            .from('invoice_items')
            .select('*')
            .eq('invoice_period_id', invoiceId);

        if (itemsError) throw itemsError;

        const { data: adjustments, error: adjustmentsError } = await supabase
            .from('invoice_adjustments')
            .select('*')
            .eq('invoice_period_id', invoiceId);

        if (adjustmentsError) throw adjustmentsError;

        return {
            period,
            items: items || [],
            adjustments: adjustments || [],
        };
    },

    /**
     * Delete an invoice
     */
    async deleteInvoice(invoiceId: string): Promise<void> {
        const { error } = await supabase
            .from('invoice_periods')
            .delete()
            .eq('id', invoiceId);

        if (error) throw error;
    },
};
