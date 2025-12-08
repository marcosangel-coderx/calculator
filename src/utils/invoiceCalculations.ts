import { startOfMonth, endOfMonth, parseISO, isWeekend, eachDayOfInterval, isSameDay, isBefore, isAfter, format } from 'date-fns';

export interface PeriodInfo {
    type: 'first_half' | 'second_half';
    start: Date;
    end: Date;
    startStr: string;
    endStr: string;
}

/**
 * Get the current invoice period based on today's date
 */
export function getCurrentPeriod(date: Date = new Date()): PeriodInfo {
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    if (day <= 15) {
        const start = new Date(year, month, 1);
        const end = new Date(year, month, 15);
        return {
            type: 'first_half',
            start,
            end,
            startStr: format(start, 'yyyy-MM-dd'),
            endStr: format(end, 'yyyy-MM-dd'),
        };
    } else {
        const start = new Date(year, month, 16);
        const end = endOfMonth(date);
        return {
            type: 'second_half',
            start,
            end,
            startStr: format(start, 'yyyy-MM-dd'),
            endStr: format(end, 'yyyy-MM-dd'),
        };
    }
}

/**
 * Get a specific period by date and type
 */
export function getPeriod(date: Date, type: 'first_half' | 'second_half'): PeriodInfo {
    const year = date.getFullYear();
    const month = date.getMonth();

    if (type === 'first_half') {
        const start = new Date(year, month, 1);
        const end = new Date(year, month, 15);
        return {
            type: 'first_half',
            start,
            end,
            startStr: format(start, 'yyyy-MM-dd'),
            endStr: format(end, 'yyyy-MM-dd'),
        };
    } else {
        const start = new Date(year, month, 16);
        const end = endOfMonth(date);
        return {
            type: 'second_half',
            start,
            end,
            startStr: format(start, 'yyyy-MM-dd'),
            endStr: format(end, 'yyyy-MM-dd'),
        };
    }
}

/**
 * Calculate working days between two dates (excluding weekends)
 */
export function calculateWorkingDays(startDate: string | Date, endDate: string | Date): number {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    const days = eachDayOfInterval({ start, end });
    return days.filter(day => !isWeekend(day)).length;
}

/**
 * Calculate total days between two dates (including weekends)
 */
export function calculateTotalDays(startDate: string | Date, endDate: string | Date): number {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    const days = eachDayOfInterval({ start, end });
    return days.length;
}

/**
 * Calculate working days in a specific month
 */
export function calculateWorkingDaysInMonth(year: number, month: number): number {
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(new Date(year, month));

    const days = eachDayOfInterval({ start, end });
    return days.filter(day => !isWeekend(day)).length;
}

/**
 * Get the effective start date for a project within a period
 * (whichever is later: project start or period start)
 */
export function getEffectiveStartDate(projectStartDate: string, periodStart: Date): Date {
    const projectStart = parseISO(projectStartDate);
    return isAfter(projectStart, periodStart) ? projectStart : periodStart;
}

/**
 * Get the effective end date for a project within a period
 * (whichever is earlier: discontinued date, period end, or period end if active)
 */
export function getEffectiveEndDate(
    discontinuedDate: string | null,
    periodEnd: Date
): Date {
    if (!discontinuedDate) {
        return periodEnd;
    }

    const discontinued = parseISO(discontinuedDate);
    return isBefore(discontinued, periodEnd) ? discontinued : periodEnd;
}

/**
 * Calculate daily rate based on monthly rate and working days in the month
 */
export function calculateDailyRate(monthlyRate: number, periodStart: Date): number {
    const year = periodStart.getFullYear();
    const month = periodStart.getMonth();
    const workingDaysInMonth = calculateWorkingDaysInMonth(year, month);
    return monthlyRate / workingDaysInMonth;
}

/**
 * Calculate hourly rate from daily rate
 */
export function calculateHourlyRate(dailyRate: number): number {
    return dailyRate / 8;
}
