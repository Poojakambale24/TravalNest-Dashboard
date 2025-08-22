"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Booking Actions
export async function createBooking(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const customerId = formData.get("customer_id") as string
  const destinationId = formData.get("destination_id") as string
  const checkInDate = formData.get("check_in_date") as string
  const checkOutDate = formData.get("check_out_date") as string
  const guests = Number.parseInt(formData.get("guests") as string)
  const specialRequests = formData.get("special_requests") as string
  const totalAmount = Number.parseFloat(formData.get("total_amount") as string)

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Generate booking reference
  const bookingReference = `TRV-${Date.now().toString().slice(-6)}`

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      customer_id: customerId,
      destination_id: destinationId,
      agent_id: user.id,
      booking_reference: bookingReference,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      guests,
      total_amount: totalAmount,
      special_requests: specialRequests,
      status: "pending",
      payment_status: "pending",
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create booking: ${error.message}`)
  }

  revalidatePath("/dashboard/bookings")
  redirect(`/dashboard/bookings/${data.id}`)
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId)

  if (error) {
    throw new Error(`Failed to update booking status: ${error.message}`)
  }

  revalidatePath("/dashboard/bookings")
  revalidatePath(`/dashboard/bookings/${bookingId}`)
}

export async function updatePaymentStatus(bookingId: string, paymentStatus: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { error } = await supabase.from("bookings").update({ payment_status: paymentStatus }).eq("id", bookingId)

  if (error) {
    throw new Error(`Failed to update payment status: ${error.message}`)
  }

  revalidatePath("/dashboard/bookings")
  revalidatePath(`/dashboard/bookings/${bookingId}`)
}

export async function deleteBooking(bookingId: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { error } = await supabase.from("bookings").delete().eq("id", bookingId)

  if (error) {
    throw new Error(`Failed to delete booking: ${error.message}`)
  }

  revalidatePath("/dashboard/bookings")
  redirect("/dashboard/bookings")
}

// Customer Actions
export async function createCustomer(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const fullName = formData.get("full_name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const passportNumber = formData.get("passport_number") as string
  const dateOfBirth = formData.get("date_of_birth") as string

  const { data, error } = await supabase
    .from("customers")
    .insert({
      full_name: fullName,
      email,
      phone: phone || null,
      address: address || null,
      passport_number: passportNumber || null,
      date_of_birth: dateOfBirth || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create customer: ${error.message}`)
  }

  revalidatePath("/dashboard/customers")
  redirect(`/dashboard/customers/${data.id}`)
}

export async function updateCustomer(customerId: string, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const fullName = formData.get("full_name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const passportNumber = formData.get("passport_number") as string
  const dateOfBirth = formData.get("date_of_birth") as string

  const { error } = await supabase
    .from("customers")
    .update({
      full_name: fullName,
      email,
      phone: phone || null,
      address: address || null,
      passport_number: passportNumber || null,
      date_of_birth: dateOfBirth || null,
    })
    .eq("id", customerId)

  if (error) {
    throw new Error(`Failed to update customer: ${error.message}`)
  }

  revalidatePath("/dashboard/customers")
  revalidatePath(`/dashboard/customers/${customerId}`)
}

export async function deleteCustomer(customerId: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { error } = await supabase.from("customers").delete().eq("id", customerId)

  if (error) {
    throw new Error(`Failed to delete customer: ${error.message}`)
  }

  revalidatePath("/dashboard/customers")
  redirect("/dashboard/customers")
}

// Profile Actions
export async function updateProfile(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const fullName = formData.get("full_name") as string
  const email = formData.get("email") as string

  // Update profile
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      email,
    })
    .eq("id", user.id)

  if (profileError) {
    throw new Error(`Failed to update profile: ${profileError.message}`)
  }

  // Update auth email if changed
  if (email !== user.email) {
    const { error: authError } = await supabase.auth.updateUser({ email })
    if (authError) {
      throw new Error(`Failed to update email: ${authError.message}`)
    }
  }

  revalidatePath("/dashboard/settings")
}

export async function updatePassword(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const newPassword = formData.get("new_password") as string

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) {
    throw new Error(`Failed to update password: ${error.message}`)
  }

  revalidatePath("/dashboard/settings")
}
