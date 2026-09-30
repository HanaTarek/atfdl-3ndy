"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/util/supabase/server-client";
import { revalidatePath } from "next/cache";
import { createClient as createStandardClient } from "@/util/supabase/server-client";
import { createClient as createManagementClient } from "@supabase/supabase-js";

async function requireAdmin(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return admin ? user : null;
}

export async function getAllPropertiesAdmin({ limit = 100 } = {}) {
  const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (!admin) throw new Error("Not authorized.");

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data;
}

export async function getAllUsersAdmin({ limit = 100 } = {}) {
  const standardClient = await createStandardClient();
  const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (!admin) throw new Error("Not authorized.");

  const {
    data: { user: currentUser },
  } = await standardClient.auth.getUser();
  if (!currentUser) throw new Error("Unauthorized");

  const { data: adminRecord } = await standardClient
    .from("admins")
    .select("user_id")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (!adminRecord) {
    throw new Error("Unauthorized: Admin privileges required.");
  }

  const supabaseAdmin = createManagementClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  // Fetch auth users AND the list of admin ids in parallel
  const [usersRes, adminsRes] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 }),
    supabaseAdmin.from("admins").select("user_id"),
  ]);

  if (usersRes.error) {
    console.error("Failed to fetch auth users:", usersRes.error.message);
    return { success: false, error: usersRes.error.message, users: [] };
  }

  const adminIds = new Set((adminsRes.data ?? []).map((a) => a.user_id));

  // Shape each raw auth user into exactly what <UserManagement /> expects.
  // This also stops sending phone, identities, app_metadata etc. to the browser.
  const users = usersRes.data.users
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // newest first
    .slice(0, limit) // keep only `limit` users
    .map((u) => ({
      id: u.id,
      name: u.user_metadata?.full_name ?? u.email ?? "Unknown",
      email: u.email ?? "",
      role: adminIds.has(u.id) ? "Admin" : "Guest",
      status:
        u.banned_until && new Date(u.banned_until) > new Date()
          ? "suspended"
          : "active",
      joined: new Date(u.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));

  return { success: true, users };
}

export async function rejectPropertyAdmin(propertyId) {

  const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (!admin) throw new Error("Not authorized.");

  const { data, error } = await supabase
    .from("properties")
    .update({ status: "rejected" })
    .eq("id", propertyId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/dashboard");

  return { success: true };
}

export async function AprovePropertyAdmin(propertyId) {

  const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (!admin) throw new Error("Not authorized.");

  const { data, error } = await supabase
    .from("properties")
    .update({ status: "approved" })
    .eq("id", propertyId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/dashboard");

  return { success: true };
}







export async function getPendingProperties() {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) throw new Error("Not authorized.");

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function approvePropertyAction(propertyId) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: ["Not authorized."] };

  const { error } = await supabase
    .from("properties")
    .update({ status: "approved" })
    .eq("id", propertyId);

  if (error) return { error: [error.message] };

  revalidatePath("/admin/properties");
  revalidatePath("/property");
  return { success: true };
}

export async function rejectPropertyAction(propertyId) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: ["Not authorized."] };

  const { error } = await supabase
    .from("properties")
    .update({ status: "rejected" })
    .eq("id", propertyId);

  if (error) return { error: [error.message] };

  revalidatePath("/admin/properties");
  return { success: true };
}
