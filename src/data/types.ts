// plan card types 

export type Collection = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  created_at: string;
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
};