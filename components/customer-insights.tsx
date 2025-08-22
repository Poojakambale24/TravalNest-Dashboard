import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export async function CustomerInsights() {
  const supabase = createClient()

  // Get top customers by total spending
  const { data: topCustomers } = await supabase
    .from("bookings")
    .select(`
      total_amount,
      customers (id, full_name, email)
    `)
    .eq("payment_status", "paid")
    .order("total_amount", { ascending: false })
    .limit(5)

  // Group by customer and sum their spending
  const customerSpending = topCustomers?.reduce((acc: any[], booking) => {
    const existingCustomer = acc.find((c) => c.id === booking.customers?.id)
    if (existingCustomer) {
      existingCustomer.totalSpent += booking.total_amount
      existingCustomer.bookings += 1
    } else if (booking.customers) {
      acc.push({
        id: booking.customers.id,
        name: booking.customers.full_name,
        email: booking.customers.email,
        totalSpent: booking.total_amount,
        bookings: 1,
      })
    }
    return acc
  }, [])

  // Sort by total spent and take top 5
  const sortedCustomers = customerSpending?.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>Customers with highest total spending</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedCustomers.map((customer, index) => (
            <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt={customer.name} />
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${customer.totalSpent.toLocaleString()}</p>
                <Badge variant="secondary">{customer.bookings} bookings</Badge>
              </div>
            </div>
          ))}
          {sortedCustomers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No customer data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
