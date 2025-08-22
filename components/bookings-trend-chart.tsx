"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface BookingTrendData {
  month: string
  bookings: number
  confirmed: number
  cancelled: number
}

interface BookingsTrendChartProps {
  data: BookingTrendData[]
}

export function BookingsTrendChart({ data }: BookingsTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Trends</CardTitle>
        <CardDescription>Monthly booking status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            bookings: {
              label: "Total Bookings",
              color: "hsl(var(--chart-1))",
            },
            confirmed: {
              label: "Confirmed",
              color: "hsl(var(--chart-2))",
            },
            cancelled: {
              label: "Cancelled",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} />
              <Line type="monotone" dataKey="confirmed" stroke="var(--color-confirmed)" strokeWidth={2} />
              <Line type="monotone" dataKey="cancelled" stroke="var(--color-cancelled)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
