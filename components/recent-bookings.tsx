import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"

export async function RecentBookings() {
  const supabase = createClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
      *,
      customers (full_name, email),
      destinations (name, city, country)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Latest travel bookings from customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings?.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{booking.customers?.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.destinations?.name} - {booking.destinations?.city}, {booking.destinations?.country}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(booking.check_in_date), "MMM dd")} -{" "}
                  {format(new Date(booking.check_out_date), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="text-right space-y-1">
                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                <p className="text-sm font-medium">${booking.total_amount}</p>
              </div>
            </div>
          ))}
          {!bookings?.length && <div className="text-center py-8 text-muted-foreground">No recent bookings found</div>}
        </div>
      </CardContent>
    </Card>
  )
}
