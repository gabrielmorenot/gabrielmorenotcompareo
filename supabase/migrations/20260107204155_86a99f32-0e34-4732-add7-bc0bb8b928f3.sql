-- Enum for categories
CREATE TYPE public.product_category AS ENUM ('tv', 'celular', 'geladeira', 'ar-condicionado', 'lavadora', 'notebook', 'fogao');

-- Enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Stores (partner stores)
CREATE TABLE public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    link TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Offers (products)
CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category product_category NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount INTEGER DEFAULT 0,
    store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
    affiliate_link TEXT NOT NULL,
    image_url TEXT,
    is_daily_offer BOOLEAN NOT NULL DEFAULT false,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Banners
CREATE TABLE public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT,
    button_text TEXT DEFAULT 'Ver ofertas',
    button_link TEXT,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table for admin access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Public read policies for stores, offers, banners (public site)
CREATE POLICY "Public can read active stores"
ON public.stores FOR SELECT
USING (active = true);

CREATE POLICY "Public can read active offers"
ON public.offers FOR SELECT
USING (active = true);

CREATE POLICY "Public can read active banners"
ON public.banners FOR SELECT
USING (active = true);

-- Admin policies for stores
CREATE POLICY "Admins can manage stores"
ON public.stores FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin policies for offers
CREATE POLICY "Admins can manage offers"
ON public.offers FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin policies for banners
CREATE POLICY "Admins can manage banners"
ON public.banners FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User roles: users can read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can manage all roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stores_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();