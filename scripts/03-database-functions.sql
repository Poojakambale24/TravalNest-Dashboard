-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'agent'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate booking totals
CREATE OR REPLACE FUNCTION calculate_booking_total(
  destination_id UUID,
  check_in_date DATE,
  check_out_date DATE
)
RETURNS DECIMAL AS $$
DECLARE
  price_per_night DECIMAL;
  nights INTEGER;
BEGIN
  -- Get destination price
  SELECT d.price_per_night INTO price_per_night
  FROM destinations d
  WHERE d.id = destination_id;
  
  -- Calculate nights
  nights := check_out_date - check_in_date;
  
  -- Return total
  RETURN price_per_night * nights;
END;
$$ LANGUAGE plpgsql;

-- Function to get booking statistics
CREATE OR REPLACE FUNCTION get_booking_stats(agent_id UUID DEFAULT NULL)
RETURNS TABLE(
  total_bookings BIGINT,
  confirmed_bookings BIGINT,
  pending_bookings BIGINT,
  cancelled_bookings BIGINT,
  total_revenue DECIMAL,
  average_booking_value DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_bookings,
    COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
    COALESCE(SUM(total_amount) FILTER (WHERE payment_status = 'paid'), 0) as total_revenue,
    COALESCE(AVG(total_amount) FILTER (WHERE payment_status = 'paid'), 0) as average_booking_value
  FROM bookings b
  WHERE (agent_id IS NULL OR b.agent_id = get_booking_stats.agent_id);
END;
$$ LANGUAGE plpgsql;

-- Function to get popular destinations
CREATE OR REPLACE FUNCTION get_popular_destinations(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  destination_id UUID,
  destination_name TEXT,
  city TEXT,
  country TEXT,
  booking_count BIGINT,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id as destination_id,
    d.name as destination_name,
    d.city,
    d.country,
    COUNT(b.id) as booking_count,
    COALESCE(SUM(b.total_amount) FILTER (WHERE b.payment_status = 'paid'), 0) as total_revenue
  FROM destinations d
  LEFT JOIN bookings b ON d.id = b.destination_id
  GROUP BY d.id, d.name, d.city, d.country
  ORDER BY booking_count DESC, total_revenue DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get customer insights
CREATE OR REPLACE FUNCTION get_customer_insights(customer_id UUID)
RETURNS TABLE(
  total_bookings BIGINT,
  total_spent DECIMAL,
  average_booking_value DECIMAL,
  favorite_destination TEXT,
  last_booking_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(b.id) as total_bookings,
    COALESCE(SUM(b.total_amount) FILTER (WHERE b.payment_status = 'paid'), 0) as total_spent,
    COALESCE(AVG(b.total_amount) FILTER (WHERE b.payment_status = 'paid'), 0) as average_booking_value,
    (
      SELECT d.name 
      FROM destinations d
      JOIN bookings b2 ON d.id = b2.destination_id
      WHERE b2.customer_id = get_customer_insights.customer_id
      GROUP BY d.id, d.name
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as favorite_destination,
    MAX(b.created_at::DATE) as last_booking_date
  FROM bookings b
  WHERE b.customer_id = get_customer_insights.customer_id;
END;
$$ LANGUAGE plpgsql;
