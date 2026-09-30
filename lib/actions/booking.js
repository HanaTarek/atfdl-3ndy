"use server";
import { createClient } from "@/util/supabase/server-client";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createAdminClient } from "@/util/supabase/admin-client";


const resend = new Resend(process.env.RESEND_API_KEY);


export async function getBookedDates(propertyId, rangeStart, rangeEnd) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_booked_dates", {
    p_property_id: propertyId,
    p_range_start: rangeStart,
    p_range_end: rangeEnd,
  });

  if (error) {
    throw new Error(`Failed to fetch availability: ${error.message}`);
  }
    return {
        accepted: data
        .filter((d) => d.booking_status === "accepted")
        .map((d) => d.booked_date),
        pending: data
        .filter((d) => d.booking_status === "pending")
        .map((d) => d.booked_date),
    };

}


export async function createBookingAction(propertyId, checkIn, checkOut) {
  const supabase = await createClient();

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    user = null;
  }
   console.log("the user in createBookingAction" , user);
  if (!user) {
    return { error: "You must be signed in to request a booking." };
  }

  const { data, error } = await supabase.rpc("create_booking", {
    p_property_id: propertyId,
    p_check_in: checkIn,
    p_check_out: checkOut,
  });


  if (error) {
     return { error: error.message };
  }
   console.log("the error in createBookingAction", error);
   console.log("the data in createBookingAction", data);


  // Fetch the host's email + property title for the notification
  const { data: property } = await supabase
    .from("properties")
    .select("title, host_id")
    .eq("id", propertyId)
    .single();

  if (property) {
    const adminClient = createAdminClient();
    const { data: hostAuthData } = await adminClient.auth.admin.getUserById(
     property.host_id,
    );
    const hostEmail = hostAuthData?.user?.email;

    if (hostEmail) {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev", 
          to: "hanatarek094@gmail.com",
          subject: `New booking request for ${property.title}`,
          html: `
            <p>You have a new booking request for <strong>${property.title}</strong>.</p>
            <p>Dates: ${checkIn} → ${checkOut}</p>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings">Review the request</a></p>
          `,
        });
      } catch (emailError) {
        // Don't fail the booking if the email fails — log and move on
        console.error("Failed to send host notification email:", emailError);
      }
    }
  }

  revalidatePath(`/property`);
  return { success: true, booking: data };
}