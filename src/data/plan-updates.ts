import { supabase } from "@/lib/supabase";

import { Plan } from "./types";

export async function togglePinnedDb(plan: Plan) {
    const changes = { pinned: !plan.pinned };

    const { error } = await supabase.from('plans').update(changes).eq('id', plan.id);
    return error ? null : changes;
}

export async function toggleCompletedDb(plan: Plan) {
    const changes = {
        completed_at: plan.completed_at ? null : new Date().toISOString(),
        pinned: false
     };

    const { error } = await supabase.from('plans').update(changes).eq('id', plan.id);
    return error ? null : changes;
}

// object with some of the fields of a plan (pinned: true, completed_at)
export function applyChanges(plans: Plan[], planId: string, changes: Partial<Plan>) {
    return plans.map((plan) => (plan.id === planId ? { ...plan, ...changes } : plan));
}