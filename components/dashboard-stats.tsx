import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Calendar, DollarSign, MapPin, Users } from "lucide-react"

export async function DashboardStats() {
  const supabase = createClient()

  // Get statistics
  const [{ count: totalBookings }, { count: totalCustomers }, { count: totalDestinations }, { data: revenueData }] =
    await Promise.all([
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase.from("destinations").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("total_amount").eq("payment_status", "paid"),
    ])

  const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings || 0,
      description: "Active travel bookings",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: totalCustomers || 0,
      description: "Registered customers",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Destinations",
      value: totalDestinations || 0,
      description: "Available destinations",
      icon: MapPin,
      color: "text-purple-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      description: "From paid bookings",
      icon: DollarSign,
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
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
