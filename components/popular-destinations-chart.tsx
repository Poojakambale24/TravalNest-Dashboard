"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface DestinationData {
  name: string
  bookings: number
  revenue: number
}

interface PopularDestinationsChartProps {
  data: DestinationData[]
}

export function PopularDestinationsChart({ data }: PopularDestinationsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Destinations</CardTitle>
        <CardDescription>Top destinations by booking count</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            bookings: {
              label: "Bookings",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="horizontal">
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="bookings" fill="var(--color-bookings)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
