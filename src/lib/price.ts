import type { Plan } from '@/data/types';

// typed price
export function parsePrice(text: string) {
    const normalized = text.trim().replace(',', '.');
    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
    return Number(normalized);
}

// saved price to db
export function priceToInput(price : number | null) {
    return price === null ? '' : String(price).replace('.', ',');
}

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

// from '12.00' to '12,00€'
export function formatPrice(price: number) {
    return euros.format(price);
}

// sum of prices
export function sumPrices(plans: Plan[]) {
    const withPrice = plans.filter((plan) => plan.price !== null);
    if (withPrice.length === 0) return null; // a collection shows nothing when the plans have no price
    
    // 'reduce' combines a whole list into a single value. for each plan, price is added to sum
    return withPrice.reduce((sum, plan) => sum + (plan.price ?? 0), 0);
}