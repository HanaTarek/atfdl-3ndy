import "server-only";
// Use your existing imports/paths for these:
import { createClient } from "@/util/supabase/server-client";
import { createClient as createManagementClient } from "@supabase/supabase-js";

export async function getDashboardStats() {
  const supabase = await createClient();

  // --- same admin check you use in getAllUsersAdmin ---
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: adminRecord } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminRecord) throw new Error("Unauthorized: Admin privileges required.");
  // ----------------------------------------------------

  const supabaseAdmin = createManagementClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // head: true + count: "exact" => returns ONLY the number, no rows downloaded
  const countOnly = { count: "exact", head: true };

  const [totalRes, weekRes, pendingRes, usersRes] = await Promise.all([
    supabase.from("properties").select("*", countOnly),
    supabase
      .from("properties")
      .select("*", countOnly)
      .gte("created_at", weekAgo.toISOString()),
    supabase.from("properties").select("*", countOnly).eq("status", "pending"),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 100 }),
  ]);

  for (const res of [totalRes, weekRes, pendingRes, usersRes]) {
    if (res.error) throw new Error(res.error.message);
  }

  const totalProperties = totalRes.count ?? 0;
  const newProperties = weekRes.count ?? 0;
  const pending = pendingRes.count ?? 0;

  const users = usersRes.data.users;
  const totalUsers = usersRes.data.total ?? users.length;
  const newUsers = users.filter(
    (u) => new Date(u.created_at) >= weekAgo,
  ).length;

  // Same shape as <StatCard label value hint />
  return [
    {
      label: "Total properties",
      value: totalProperties.toLocaleString(),
      hint: `+${newProperties} this week`,
    },
    {
      label: "Pending approval",
      value: pending.toLocaleString(),
      hint: pending > 0 ? "Needs your review" : "All caught up",
    },
    {
      label: "Registered users",
      value: totalUsers.toLocaleString(),
      hint: `+${newUsers} this week`,
    },
  ];
}
