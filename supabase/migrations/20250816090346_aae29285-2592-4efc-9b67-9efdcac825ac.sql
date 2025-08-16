-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'user');

-- Create enum for product types
CREATE TYPE public.product_type AS ENUM ('free', 'paid');

-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for notification types
CREATE TYPE public.notification_type AS ENUM ('request_approved', 'request_rejected', 'task_assigned', 'product_upload');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  telegram_link TEXT,
  whatsapp_link TEXT,
  facebook_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  product_type product_type NOT NULL DEFAULT 'free',
  bucket_name TEXT NOT NULL UNIQUE,
  images TEXT[] DEFAULT '{}',
  file_paths TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  downloads_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payment requests table
CREATE TABLE public.payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  payment_screenshot_url TEXT,
  contact_method TEXT, -- telegram, whatsapp, facebook
  contact_info TEXT,
  status request_status DEFAULT 'pending',
  approved_by UUID REFERENCES public.profiles(user_id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user downloads table (tracks approved downloads)
CREATE TABLE public.user_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type notification_type NOT NULL,
  read BOOLEAN DEFAULT false,
  related_id UUID, -- can reference request_id, product_id, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tasks table for admin task assignments
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin or super admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role IN ('admin', 'super_admin')
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Allow profile creation" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for products
CREATE POLICY "Anyone can view products" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage products" 
ON public.products FOR ALL 
USING (public.is_admin(auth.uid()));

-- RLS Policies for payment requests
CREATE POLICY "Users can view their own requests" 
ON public.payment_requests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests" 
ON public.payment_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests" 
ON public.payment_requests FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all requests" 
ON public.payment_requests FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- RLS Policies for user downloads
CREATE POLICY "Users can view their own downloads" 
ON public.user_downloads FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create downloads" 
ON public.user_downloads FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all downloads" 
ON public.user_downloads FOR SELECT 
USING (public.is_admin(auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications FOR INSERT 
WITH CHECK (true);

-- RLS Policies for tasks
CREATE POLICY "Users can view assigned tasks" 
ON public.tasks FOR SELECT 
USING (auth.uid() = assigned_to OR public.is_admin(auth.uid()));

CREATE POLICY "Users can update assigned tasks" 
ON public.tasks FOR UPDATE 
USING (auth.uid() = assigned_to OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can create tasks" 
ON public.tasks FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_requests_updated_at
  BEFORE UPDATE ON public.payment_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert super admin user (will be created when myne7x@gmail.com signs up)
-- Note: This will only work after the user actually signs up with the specified email

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('payment-screenshots', 'payment-screenshots', false),
  ('product-images', 'product-images', true),
  ('avatars', 'avatars', true);

-- Storage policies for payment screenshots
CREATE POLICY "Users can upload payment screenshots" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own screenshots" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all screenshots" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'payment-screenshots' AND public.is_admin(auth.uid()));

-- Storage policies for product images
CREATE POLICY "Anyone can view product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update product images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete product images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

-- Storage policies for avatars
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view all avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_downloads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;