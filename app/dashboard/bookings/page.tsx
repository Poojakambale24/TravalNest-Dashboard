import { createClient } from "@/lib/supabase/server"
import { BookingsTable } from "@/components/bookings-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function BookingsPage() {
  const supabase = createClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      customers (full_name, email),
      destinations (name, city, country)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage all travel bookings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/bookings/new">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>

      <BookingsTable bookings={bookings || []} />
    </div>
  )
}
