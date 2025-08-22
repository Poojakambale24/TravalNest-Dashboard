import { DashboardStats } from "@/components/dashboard-stats"
import { RecentBookings } from "@/components/recent-bookings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || "Agent"}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your travel bookings today.</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentBookings />
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <button className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <span>Create New Booking</span>
                <span className="text-sm text-muted-foreground">→</span>
              </button>
              <button className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <span>Add New Customer</span>
                <span className="text-sm text-muted-foreground">→</span>
              </button>
              <button className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <span>View Analytics</span>
                <span className="text-sm text-muted-foreground">→</span>
              </button>
              <button className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <span>Manage Destinations</span>
                <span className="text-sm text-muted-foreground">→</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
