import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import { Suspense } from "react";
import { getAllPropertiesAdmin, getAllUsersAdmin } from "@/lib/actions/admin";
import { getDashboardStats } from "@/lib/actions/stats";

// Dummy data for the admin pages — replace with real fetches later.

const DUMMY_STATS = [
  { label: "Total properties", value: "128", hint: "+6 this week" },
  { label: "Pending approval", value: "9", hint: "Needs your review" },
  { label: "Registered users", value: "1,432", hint: "+38 this week" },
  { label: "Active bookings", value: "57", hint: "Next 30 days" },
];

async function UsersDashboard() {

    const result = await getAllUsersAdmin({ limit: 5 });

    return (
      <>
        <ul className="mt-4 divide-y divide-[#FBDFC5]/10">
          {result.users.map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#CA6200] text-sm font-bold text-[#FBDFC5]">
                  {u.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#FBDFC5]">
                    {u.name}
                  </p>
                  <p className="truncate text-xs text-[#FBDFC5]/50">
                    {u.email}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs text-[#FBDFC5]/50">
                {u.role}
              </span>
            </li>
          ))}
        </ul>
      </>
    );
}

async function PropertiesDashboard() {
  const properties = await getAllPropertiesAdmin({ limit: 5 });
  const rows = properties.filter((p) => p.status === "pending").slice(0, 10);
  return (
    <>
      <ul className="mt-4 divide-y divide-[#FBDFC5]/10">
        {rows.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#FBDFC5]">
                {p.title}
              </p>
              <p className="truncate text-xs text-[#FBDFC5]/50">
                {p.location} · by {p.host}
              </p>
            </div>
            <span className="shrink-0 text-sm text-[#FBDFC5]/70">
              ${p.pricePerNight}
              <span className="text-[#FBDFC5]/40"> / night</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}


async function StatsDashboard() {
  const stats = await getDashboardStats();
  return (
    <>
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </>
  );
}
export default function AdminDashboardPage() {

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Admin"
        title="Dashboard"
        description="A quick look at what needs your attention today."
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Suspense fallback={<p>Fetching Stats...</p>}>
          <StatsDashboard />
        </Suspense>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Awaiting approval */}
        <section className="rounded-[1.5rem] bg-[#1f1710] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#FBDFC5]">
              Awaiting approval
            </h2>
            <Link
              href="/admin/properties"
              className="text-sm font-semibold text-[#CA6200]"
            >
              Review all
            </Link>
          </div>

          <Suspense fallback={<p>Fetching Properties...</p>}>
            <PropertiesDashboard />
          </Suspense>
        </section>

        {/* Newest users */}
        <section className="rounded-[1.5rem] bg-[#1f1710] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#FBDFC5]">
              Newest users
            </h2>
            <Link
              href="/admin/users"
              className="text-sm font-semibold text-[#CA6200]"
            >
              Manage users
            </Link>
          </div>

          <Suspense fallback={<p>Fetching users...</p>}>
            <UsersDashboard />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
