import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, DollarSign } from "lucide-react"

export default async function DestinationsPage() {
  const supabase = createClient()

  const { data: destinations } = await supabase.from("destinations").select("*").order("name", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Destinations</h1>
          <p className="text-muted-foreground">Manage available travel destinations</p>
        </div>
        <Button>Add Destination</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {destinations?.map((destination) => (
          <Card key={destination.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={destination.image_url || "/placeholder.svg?height=200&width=300"}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-white text-black">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {destination.rating}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {destination.name}
              </CardTitle>
              <CardDescription>
                {destination.city}, {destination.country}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{destination.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-600">${destination.price_per_night}/night</span>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!destinations?.length && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No destinations found. Add your first destination to get started.</p>
        </div>
      )}
    </div>
  )
}
