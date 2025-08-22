import { AnalyticsStats } from "@/components/analytics-stats"
import { RevenueChart } from "@/components/revenue-chart"
import { BookingsTrendChart } from "@/components/bookings-trend-chart"
import { PopularDestinationsChart } from "@/components/popular-destinations-chart"
import { CustomerInsights } from "@/components/customer-insights"
import { createClient } from "@/lib/supabase/server"

// Generate mock data for charts (in a real app, this would come from the database)
const generateRevenueData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map((month) => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 20000,
    bookings: Math.floor(Math.random() * 100) + 50,
  }))
}

const generateBookingTrendData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  return months.map((month) => {
    const total = Math.floor(Math.random() * 100) + 50
    const confirmed = Math.floor(total * 0.7)
    const cancelled = Math.floor(total * 0.1)
    return {
      month,
      bookings: total,
      confirmed,
      cancelled,
    }
  })
}

export default async function AnalyticsPage() {
  const supabase = createClient()

  // Get popular destinations data
  const { data: destinationBookings } = await supabase
    .from("bookings")
    .select(`
      destinations (name),
      total_amount
    `)
    .eq("payment_status", "paid")

  // Group by destination
  const destinationData = destinationBookings?.reduce((acc: any[], booking) => {
    const existingDest = acc.find((d) => d.name === booking.destinations?.name)
    if (existingDest) {
      existingDest.bookings += 1
      existingDest.revenue += booking.total_amount
    } else if (booking.destinations) {
      acc.push({
        name: booking.destinations.name,
        bookings: 1,
        revenue: booking.total_amount,
      })
    }
    return acc
  }, [])

  const sortedDestinations = destinationData?.sort((a, b) => b.bookings - a.bookings).slice(0, 5) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground">Insights into your travel business performance</p>
      </div>

      <AnalyticsStats />

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart data={generateRevenueData()} />
        <BookingsTrendChart data={generateBookingTrendData()} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PopularDestinationsChart data={sortedDestinations} />
        <CustomerInsights />
      </div>
    </div>
  )
}
