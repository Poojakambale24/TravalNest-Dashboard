-- Insert sample destinations
INSERT INTO public.destinations (name, country, city, description, image_url, price_per_night, rating) VALUES
('Grand Palace Hotel', 'Thailand', 'Bangkok', 'Luxury hotel in the heart of Bangkok with stunning city views', '/placeholder.svg?height=200&width=300', 150.00, 4.8),
('Santorini Villa', 'Greece', 'Santorini', 'Beautiful villa overlooking the Aegean Sea with infinity pool', '/placeholder.svg?height=200&width=300', 280.00, 4.9),
('Tokyo Tower Hotel', 'Japan', 'Tokyo', 'Modern hotel near Tokyo Tower with traditional Japanese service', '/placeholder.svg?height=200&width=300', 200.00, 4.7),
('Bali Beach Resort', 'Indonesia', 'Bali', 'Tropical paradise resort with private beach access', '/placeholder.svg?height=200&width=300', 180.00, 4.6),
('Swiss Alpine Lodge', 'Switzerland', 'Zermatt', 'Cozy mountain lodge with Matterhorn views', '/placeholder.svg?height=200&width=300', 320.00, 4.8),
('Dubai Marina Hotel', 'UAE', 'Dubai', 'Luxury hotel in Dubai Marina with world-class amenities', '/placeholder.svg?height=200&width=300', 250.00, 4.7);

-- Insert sample customers
INSERT INTO public.customers (full_name, email, phone, address, passport_number) VALUES
('John Smith', 'john.smith@email.com', '+1-555-0123', '123 Main St, New York, NY 10001', 'US123456789'),
('Emma Johnson', 'emma.johnson@email.com', '+1-555-0124', '456 Oak Ave, Los Angeles, CA 90210', 'US987654321'),
('Michael Brown', 'michael.brown@email.com', '+44-20-7946-0958', '789 High St, London, UK', 'GB456789123'),
('Sarah Davis', 'sarah.davis@email.com', '+61-2-9876-5432', '321 Collins St, Melbourne, Australia', 'AU789123456'),
('David Wilson', 'david.wilson@email.com', '+49-30-12345678', 'Unter den Linden 1, Berlin, Germany', 'DE123789456');

-- Generate booking references and insert sample bookings
INSERT INTO public.bookings (customer_id, destination_id, booking_reference, check_in_date, check_out_date, guests, total_amount, status, payment_status) 
SELECT 
  c.id,
  d.id,
  'TRV-' || LPAD((ROW_NUMBER() OVER())::TEXT, 6, '0'),
  CURRENT_DATE + INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '37 days',
  2,
  d.price_per_night * 7,
  CASE 
    WHEN ROW_NUMBER() OVER() % 3 = 0 THEN 'confirmed'
    WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'pending'
    ELSE 'completed'
  END,
  CASE 
    WHEN ROW_NUMBER() OVER() % 3 = 0 THEN 'paid'
    WHEN ROW_NUMBER() OVER() % 3 = 1 THEN 'pending'
    ELSE 'paid'
  END
FROM public.customers c
CROSS JOIN public.destinations d
WHERE ROW_NUMBER() OVER() <= 8;
