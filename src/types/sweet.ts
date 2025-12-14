export interface Sweet {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  quantity: number;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  sweet_id: string;
  quantity: number;
  total_price: number;
  created_at: string;
}

export type SweetFormData = {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image_url: string;
};
