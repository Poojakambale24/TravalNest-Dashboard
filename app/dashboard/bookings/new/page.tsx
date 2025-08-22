import { createClient } from "@/lib/supabase/server"
import { NewBookingForm } from "@/components/new-booking-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewBookingPage() {
  const supabase = createClient()

  const [{ data: customers }, { data: destinations }] = await Promise.all([
    supabase.from("customers").select("id, full_name, email").order("full_name"),
    supabase.from("destinations").select("id, name, city, country, price_per_night").order("name"),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Booking</h1>
          <p className="text-muted-foreground">Create a new travel booking</p>
        </div>
      </div>

      <NewBookingForm customers={customers || []} destinations={destinations || []} />
    </div>
  )
}
