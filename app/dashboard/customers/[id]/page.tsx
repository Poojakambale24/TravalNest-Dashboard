import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { notFound } from "next/navigation"

interface CustomerDetailsPageProps {
  params: {
    id: string
  }
}

export default async function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const supabase = createClient()

  const [{ data: customer }, { data: bookings }] = await Promise.all([
    supabase.from("customers").select("*").eq("id", params.id).single(),
    supabase
      .from("bookings")
      .select(`
        *,
        destinations (name, city, country)
      `)
      .eq("customer_id", params.id)
      .order("created_at", { ascending: false }),
  ])

  if (!customer) {
    notFound()
  }

  const totalSpent = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
  const totalBookings = bookings?.length || 0

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

  const userInitials = customer.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Customer Details</h1>
            <p className="text-muted-foreground">{customer.full_name}</p>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Customer
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt={customer.full_name} />
                <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{customer.full_name}</h3>
                <p className="text-muted-foreground">
                  Customer since {format(new Date(customer.created_at), "MMM yyyy")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.address}</span>
                </div>
              )}
              {customer.passport_number && (
                <div>
                  <span className="text-sm text-muted-foreground">Passport: </span>
                  <span className="text-sm font-medium">{customer.passport_number}</span>
                </div>
              )}
              {customer.date_of_birth && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{format(new Date(customer.date_of_birth), "PPP")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalBookings}</div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">${totalSpent.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
            {totalBookings > 0 && (
              <div className="text-center">
                <div className="text-xl font-semibold">${Math.round(totalSpent / totalBookings).toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Average per Booking</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings?.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{booking.destinations?.name}</p>
                    <p className="text-muted-foreground">{format(new Date(booking.created_at), "MMM dd, yyyy")}</p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
              ))}
              {!bookings?.length && <p className="text-sm text-muted-foreground">No bookings yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings?.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{booking.destinations?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.destinations?.city}, {booking.destinations?.country}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(booking.check_in_date), "MMM dd")} -{" "}
                    {format(new Date(booking.check_out_date), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  <p className="text-sm font-medium">${booking.total_amount}</p>
                  <p className="text-xs text-muted-foreground">{booking.booking_reference}</p>
                </div>
              </div>
            ))}
            {!bookings?.length && (
              <div className="text-center py-8 text-muted-foreground">No bookings found for this customer</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
