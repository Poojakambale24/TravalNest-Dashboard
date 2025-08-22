import { NewCustomerForm } from "@/components/new-customer-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Customer</h1>
          <p className="text-muted-foreground">Add a new customer to your database</p>
        </div>
      </div>

      <NewCustomerForm />
    </div>
  )
}
