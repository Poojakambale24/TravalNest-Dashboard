import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, MapPin } from "lucide-react"

export async function AnalyticsStats() {
  const supabase = createClient()

  // Get current month stats
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7)

  const [
    { data: currentMonthBookings },
    { data: lastMonthBookings },
    { data: currentMonthRevenue },
    { data: lastMonthRevenue },
    { count: totalCustomers },
    { count: activeDestinations },
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("*")
      .gte("created_at", `${currentMonth}-01`)
      .lt("created_at", `${new Date().toISOString().slice(0, 7)}-32`),
    supabase.from("bookings").select("*").gte("created_at", `${lastMonth}-01`).lt("created_at", `${currentMonth}-01`),
    supabase
      .from("bookings")
      .select("total_amount")
      .eq("payment_status", "paid")
      .gte("created_at", `${currentMonth}-01`)
      .lt("created_at", `${new Date().toISOString().slice(0, 7)}-32`),
    supabase
      .from("bookings")
      .select("total_amount")
      .eq("payment_status", "paid")
      .gte("created_at", `${lastMonth}-01`)
      .lt("created_at", `${currentMonth}-01`),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("destinations").select("*", { count: "exact", head: true }),
  ])

  const currentBookingsCount = currentMonthBookings?.length || 0
  const lastBookingsCount = lastMonthBookings?.length || 0
  const bookingsGrowth =
    lastBookingsCount > 0 ? ((currentBookingsCount - lastBookingsCount) / lastBookingsCount) * 100 : 0

  const currentRevenue = currentMonthRevenue?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
  const lastRevenue = lastMonthRevenue?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
  const revenueGrowth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0

  const stats = [
    {
      title: "Monthly Revenue",
      value: `$${currentRevenue.toLocaleString()}`,
      change: revenueGrowth,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Monthly Bookings",
      value: currentBookingsCount.toString(),
      change: bookingsGrowth,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: (totalCustomers || 0).toString(),
      change: 0, // Would need historical data for growth calculation
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Active Destinations",
      value: (activeDestinations || 0).toString(),
      change: 0, // Would need historical data for growth calculation
      icon: MapPin,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change !== 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.change > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={stat.change > 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(stat.change).toFixed(1)}%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
