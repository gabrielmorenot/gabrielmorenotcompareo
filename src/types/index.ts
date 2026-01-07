export type Category = 'tv' | 'celular' | 'geladeira' | 'ar-condicionado' | 'lavadora' | 'notebook' | 'fogao';

export interface Store {
  id: string;
  name: string;
  logo_url: string | null;
  link: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  name: string;
  category: Category;
  price: number;
  discount: number | null;
  store_id: string | null;
  affiliate_link: string;
  image_url: string | null;
  is_daily_offer: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
  stores?: Store | null;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: 'tv', label: 'TV', icon: '📺' },
  { value: 'celular', label: 'Celular', icon: '📱' },
  { value: 'geladeira', label: 'Geladeira', icon: '🧊' },
  { value: 'ar-condicionado', label: 'Ar-condicionado', icon: '❄️' },
  { value: 'lavadora', label: 'Lavadora', icon: '🌀' },
  { value: 'notebook', label: 'Notebook', icon: '💻' },
  { value: 'fogao', label: 'Fogão', icon: '🔥' },
];
