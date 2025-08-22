import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { Plane, MapPin, Users, BarChart3, Shield, Calendar, CreditCard, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function Home() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <>
        <SiteHeader />
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Connect Supabase to get started</h1>
            <p className="text-muted-foreground">Configure your database integration to unlock TravelNest features</p>
          </div>
        </div>
      </>
    )
  }

  // Get the user from the server
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto text-center space-y-8">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl">
                <Plane className="h-16 w-16 text-white" />
              </div>
            </div>

            <div className="space-y-6">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                ✨ Professional Travel Management Platform
              </Badge>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                TravelNest
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The complete travel agency management solution. Streamline bookings, manage customers, track analytics,
                and grow your travel business with our powerful dashboard platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              >
                <Link href="/auth/sign-up">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 bg-transparent">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl font-bold">Everything You Need</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools to manage your travel agency efficiently
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg w-fit">
                    <MapPin className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Destination Management</CardTitle>
                  <CardDescription className="text-base">
                    Manage travel destinations, pricing, availability, and seasonal packages with ease
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg w-fit">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Customer Management</CardTitle>
                  <CardDescription className="text-base">
                    Track customer information, preferences, booking history, and build lasting relationships
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg w-fit">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Analytics & Reports</CardTitle>
                  <CardDescription className="text-base">
                    View booking trends, revenue analytics, and performance metrics to grow your business
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg w-fit">
                    <Calendar className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Booking System</CardTitle>
                  <CardDescription className="text-base">
                    Complete booking management with status tracking, modifications, and automated confirmations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="bg-teal-100 dark:bg-teal-900/20 p-3 rounded-lg w-fit">
                    <CreditCard className="h-8 w-8 text-teal-600" />
                  </div>
                  <CardTitle className="text-xl">Payment Processing</CardTitle>
                  <CardDescription className="text-base">
                    Secure payment handling, invoicing, and financial tracking for all transactions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg w-fit">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Secure & Reliable</CardTitle>
                  <CardDescription className="text-base">
                    Enterprise-grade security with role-based access control and data protection
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold">Why Choose TravelNest?</h2>
                  <p className="text-xl text-muted-foreground">
                    Built specifically for travel agencies, with features that matter most to your business
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Streamlined Operations</h3>
                      <p className="text-muted-foreground">
                        Automate repetitive tasks and focus on what matters - growing your business
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Real-time Insights</h3>
                      <p className="text-muted-foreground">
                        Make data-driven decisions with comprehensive analytics and reporting
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Customer Satisfaction</h3>
                      <p className="text-muted-foreground">
                        Deliver exceptional service with organized customer management tools
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">Scalable Solution</h3>
                      <p className="text-muted-foreground">Grows with your business from startup to enterprise level</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center p-6">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-muted-foreground">Travel Agencies</div>
                </Card>
                <Card className="text-center p-6">
                  <div className="text-3xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </Card>
                <Card className="text-center p-6">
                  <div className="text-3xl font-bold text-purple-600">50K+</div>
                  <div className="text-sm text-muted-foreground">Bookings Processed</div>
                </Card>
                <Card className="text-center p-6">
                  <div className="text-3xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Ready to Transform Your Travel Business?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of travel agencies already using TravelNest to streamline their operations
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
              >
                <Link href="/auth/sign-up">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 bg-transparent">
                <Link href="/auth/login">Sign In to Dashboard</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12 px-4">
          <div className="container mx-auto text-center space-y-4">
            <div className="flex justify-center items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TravelNest
              </span>
            </div>
            <p className="text-muted-foreground">© 2025 TravelNest. Pooja Kambale.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
