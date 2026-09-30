"use server";

import { createClient } from "@/util/supabase/server-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { use } from "react";

export async function getAllRequestsPerHost() {
  const supabase = await createClient();

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    user = null;
  }
  if (!user) {
    return { error: "You must be signed in to view your requests" };
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      property_id,
      guest_id,
      check_in,
      check_out,
      price_per_night,
      total_price,
      status,
      created_at,
      properties!inner (
        host_id,
        title
      )
      `,
    )
    .eq("properties.host_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllRequestsPerHost bookings error:", error);
    return { error: "Couldn't fetch your requests, try again later!" };
  }

  if (bookings.length === 0) return [];

  // One query for all guests instead of one per booking
  const guestIds = [...new Set(bookings.map((b) => b.guest_id))];

  const { data: guests, error: guestError } = await supabase
    .from("profiles")
    .select("id, full_name") // add any other fields the host should see
    .in("id", guestIds);

  if (guestError) {
    console.error("getAllRequestsPerHost guests error:", guestError);
    return { error: "Couldn't fetch the guests, try again later!" };
  }

  const guestsById = new Map(guests.map((g) => [g.id, g]));

  return bookings.map((booking) => ({
    ...booking,
    guest: guestsById.get(booking.guest_id) ?? null,
  }));

}

export async function approveRequestAction(bookingId) {
  const supabase = await createClient();

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    user = null;
  }
  if (!user) {
    return { error: "You must be signed in to manage requests." };
  }

  // Load the booking, but only if its property belongs to this user
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(
      "id, property_id, check_in, check_out, status, properties!inner(host_id)",
    )
    .eq("id", bookingId)
    .eq("properties.host_id", user.id)
    .single();

  if (bookingError || !booking) {
    return { error: "Request not found, or you don't host this property." };
  }
  if (booking.status !== "pending") {
    return { error: `This request is already ${booking.status}.` };
  }

  // Don't accept if the dates overlap a booking you already accepted
  const { data: conflicts, error: conflictError } = await supabase
    .from("bookings")
    .select("id")
    .eq("property_id", booking.property_id)
    .eq("status", "accepted")
    .lt("check_in", booking.check_out)
    .gt("check_out", booking.check_in)
    .limit(1);

  if (conflictError) {
    return { error: "Couldn't check for conflicting bookings." };
  }
  if (conflicts.length > 0) {
    return { error: "These dates overlap a booking you already accepted." };
  }

  // Accept. The status guard and .select() confirm a row really changed,
  // because an update blocked by RLS returns no error and zero rows.
  const { data: updated, error: updateError } = await supabase
    .from("bookings")
    .update({ status: "accepted" })
    .eq("id", bookingId)
    .eq("status", "pending")
    .select("id");

  if (updateError || !updated || updated.length === 0) {
    return { error: "Couldn't accept this request. Try again." };
  }

  // Auto-reject other pending requests for overlapping dates
  await supabase
    .from("bookings")
    .update({ status: "rejected" })
    .eq("property_id", booking.property_id)
    .eq("status", "pending")
    .neq("id", bookingId)
    .lt("check_in", booking.check_out)
    .gt("check_out", booking.check_in);

  revalidatePath("/host/requests");
  return { success: true };
}



export async function rejectRequestsHost(bookingId) {

const supabase = await createClient();

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    user = null;
  }
  if (!user) {
    return { error: "You must be signed in to manage requests." };
  }

  // Load the booking, but only if its property belongs to this user
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(
      "id, property_id, check_in, check_out, status, properties!inner(host_id)",
    )
    .eq("id", bookingId)
    .eq("properties.host_id", user.id)
    .single();

  if (bookingError || !booking) {
    return { error: "Request not found, or you don't host this property." };
  }
  if (booking.status !== "pending") {
    return { error: `This request is already ${booking.status}.` };
  }


  // Accept. The status guard and .select() confirm a row really changed,
  // because an update blocked by RLS returns no error and zero rows.
  const { data: updated, error: updateError } = await supabase
    .from("bookings")
    .update({ status: "rejected" })
    .eq("id", bookingId)
    .eq("status", "pending")
    .select("id");

  if (updateError || !updated || updated.length === 0) {
    return { error: "Couldn't reject this request. Try again." };
  }


  revalidatePath("/host/requests");
  return { success: true };

}
