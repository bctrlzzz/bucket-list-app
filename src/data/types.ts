// plan card types 

export type Collection = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  created_at: string;
  archived_at: string;
  start_date: string | null;
  end_date: string | null;
};

export type Plan = {
  id: string;
  title: string;
  category: string | null;
  place: string | null;
  city: string | null;
  collection_id: string | null;
  pinned: boolean;
  completed_at: string | null;
  created_at: string;
  archived_at: string;
  plan_dates?: PlanDate[]; // list of dates that supabase returns when asked for it
};

// plan date type

export type PlanDate = {
  id: string;
  plan_id: string;
  start_date: string;
  start_time: string | null;
  end_time: string |null;
  end_date: string;
  created_at: string;
}