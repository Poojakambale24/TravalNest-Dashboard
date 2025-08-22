import { createClient } from "@/lib/supabase/server"

// Booking utilities
export async function getBookingStats(agentId?: string) {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_booking_stats", {
    agent_id: agentId || null,
  })

  if (error) {
    console.error("Error fetching booking stats:", error)
    return null
  }

  return data?.[0] || null
}

export async function getPopularDestinations(limit = 10) {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_popular_destinations", {
    limit_count: limit,
  })

  if (error) {
    console.error("Error fetching popular destinations:", error)
    return []
  }

  return data || []
}

export async function getCustomerInsights(customerId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("get_customer_insights", {
    customer_id: customerId,
  })

  if (error) {
    console.error("Error fetching customer insights:", error)
    return null
  }

  return data?.[0] || null
}

// Revenue analytics
export async function getMonthlyRevenue(months = 12) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("total_amount, created_at")
    .eq("payment_status", "paid")
    .gte("created_at", new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching monthly revenue:", error)
    return []
  }

  // Group by month
  const monthlyData =
    data?.reduce((acc: any[], booking) => {
      const month = new Date(booking.created_at).toISOString().slice(0, 7) // YYYY-MM
      const existing = acc.find((item) => item.month === month)

      if (existing) {
        existing.revenue += booking.total_amount
        existing.bookings += 1
      } else {
        acc.push({
          month,
          revenue: booking.total_amount,
          bookings: 1,
        })
      }

      return acc
    }, []) || []

  return monthlyData
}

// Booking trends
export async function getBookingTrends(months = 12) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("status, created_at")
    .gte("created_at", new Date(Date.now() - months * 30 * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching booking trends:", error)
    return []
  }

  // Group by month and status
  const trendData =
    data?.reduce((acc: any[], booking) => {
      const month = new Date(booking.created_at).toISOString().slice(0, 7) // YYYY-MM
      const existing = acc.find((item) => item.month === month)

      if (existing) {
        existing.bookings += 1
        if (booking.status === "confirmed") existing.confirmed += 1
        if (booking.status === "cancelled") existing.cancelled += 1
      } else {
        acc.push({
          month,
          bookings: 1,
          confirmed: booking.status === "confirmed" ? 1 : 0,
          cancelled: booking.status === "cancelled" ? 1 : 0,
        })
      }

      return acc
    }, []) || []

  return trendData
}

// Search functionality
export async function searchBookings(
  query: string,
  filters?: {
    status?: string
    paymentStatus?: string
    dateFrom?: string
    dateTo?: string
  },
) {
  const supabase = createClient()

  let queryBuilder = supabase.from("bookings").select(`
      *,
      customers (full_name, email),
      destinations (name, city, country)
    `)

  // Apply text search
  if (query) {
    queryBuilder = queryBuilder.or(`
      booking_reference.ilike.%${query}%,
      customers.full_name.ilike.%${query}%,
      customers.email.ilike.%${query}%,
      destinations.name.ilike.%${query}%
    `)
  }

  // Apply filters
  if (filters?.status) {
    queryBuilder = queryBuilder.eq("status", filters.status)
  }

  if (filters?.paymentStatus) {
    queryBuilder = queryBuilder.eq("payment_status", filters.paymentStatus)
  }

  if (filters?.dateFrom) {
    queryBuilder = queryBuilder.gte("created_at", filters.dateFrom)
  }

  if (filters?.dateTo) {
    queryBuilder = queryBuilder.lte("created_at", filters.dateTo)
  }

  const { data, error } = await queryBuilder.order("created_at", { ascending: false }).limit(100)

  if (error) {
    console.error("Error searching bookings:", error)
    return []
  }

  return data || []
}

export async function searchCustomers(query: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .or(`
      full_name.ilike.%${query}%,
      email.ilike.%${query}%,
      phone.ilike.%${query}%
    `)
    .order("full_name", { ascending: true })
    .limit(50)

  if (error) {
    console.error("Error searching customers:", error)
    return []
  }

  return data || []
}
