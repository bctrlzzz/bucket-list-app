import { PlanDate } from "@/data/types";

// needed to show a date or range
type DateParts = {
    start_date: string;
    end_date: string | null;
    start_time: string | null;
    end_time: string | null;
}

// show in my local time zone
export function parseLocalDate(date: string) {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function todayString() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDay()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
}

function formatDay(date: string) {
  return parseLocalDate(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// '21:00:00' → '21:00'
function formatTime(time: string | null) {
    return time ? time.slice(0,5) : null;
}

export function formatDateRange(d: DateParts) {
    const start = [formatDay(d.start_date), formatTime(d.start_time)].filter(Boolean).join(',');
    
    // if no end day, add end time if there is one
    if (!d.end_date || d.end_date === d.start_date) {
        const endTime = formatTime(d.end_time);
        return endTime ? `${start}-${endTime}` : start;
    }
}

// sort dates by earliest
export function sortDates(dates: PlanDate[]) {
    // never change data directly. always make a copy (...dates)
    return [...dates].sort((a,b) => (
        a.start_date + (a.start_time ?? '')).localeCompare(b.start_date + (b.start_time ?? ''))
    )
}

// next date not finished or most recent if all finished
export function nextDate(dates: PlanDate[]) {
    const sorted = sortDates(dates);
    const today = todayString();
    return (
        sorted.find((d) => (d.end_date ?? d.start_date) >= today) ?? sorted[sorted.length - 1] ?? null
    );
}