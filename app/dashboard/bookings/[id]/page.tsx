import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { notFound } from "next/navigation"

interface BookingDetailsPageProps {
  params: {
    id: string
  }
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const supabase = createClient()

  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      customers (full_name, email, phone, address),
      destinations (name, city, country, description, image_url, price_per_night)
    `)
    .eq("id", params.id)
    .single()

  if (!booking) {
    notFound()
  }

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "refunded":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const nights = Math.ceil(
    (new Date(booking.check_out_date).getTime() - new Date(booking.check_in_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/bookings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Bookings
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <p className="text-muted-foreground">Reference: {booking.booking_reference}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status:</span>
              <Badge className={getPaymentStatusColor(booking.payment_status)}>{booking.payment_status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in:</span>
              <span>{format(new Date(booking.check_in_date), "PPP")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out:</span>
              <span>{format(new Date(booking.check_out_date), "PPP")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span>{nights} nights</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests:</span>
              <span>{booking.guests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-bold text-lg">${booking.total_amount.toLocaleString()}</span>
            </div>
            {booking.special_requests && (
              <div>
                <span className="text-muted-foreground">Special Requests:</span>
                <p className="mt-1 text-sm">{booking.special_requests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">{booking.customers.full_name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{booking.customers.email}</span>
              </div>
              {booking.customers.phone && (
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.customers.phone}</span>
                </div>
              )}
            </div>
            {booking.customers.address && (
              <div>
                <span className="text-muted-foreground">Address:</span>
                <p className="text-sm mt-1">{booking.customers.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Destination Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <img
                src={booking.destinations.image_url || "/placeholder.svg?height=200&width=300"}
                alt={booking.destinations.name}
                className="w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold">{booking.destinations.name}</h3>
                <p className="text-muted-foreground">
                  {booking.destinations.city}, {booking.destinations.country}
                </p>
                <p className="text-sm">{booking.destinations.description}</p>
                <p className="text-sm text-muted-foreground">Rate: ${booking.destinations.price_per_night}/night</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
