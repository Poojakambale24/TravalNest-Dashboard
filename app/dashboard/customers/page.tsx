import { createClient } from "@/lib/supabase/server"
import { CustomersTable } from "@/components/customers-table"

export default async function CustomersPage() {
  const supabase = createClient()

  const { data: customers } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage your customer database</p>
      </div>

      <CustomersTable customers={customers || []} />
    </div>
  )
}
