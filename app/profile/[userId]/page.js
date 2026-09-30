import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProfileCard from "@/components/profile/ProfileCard";
import { createClient } from "@/util/supabase/server-client";
// import { getProfile } from "@/lib/actions/profile"; // wire in later

async function Profile({ userId }) {
  const supabase = await createClient();

  let sessionUser = null;
  try {
    const { data } = await supabase.auth.getUser();
    sessionUser = data?.user ?? null;
  } catch {
    sessionUser = null;
  }

  const profile = null; 

  if (!profile) notFound();

  const isOwner = sessionUser?.id === userId;

  return <ProfileCard profile={profile} isOwner={isOwner} />;
}

export default async function ProfilePage({ params }) {
  const { userId } = await params;

  return (
    <main className="min-h-screen bg-[#17110C] px-6 pb-20 pt-28 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Suspense
          fallback={
            <p className="text-sm text-[#FBDFC5]/50">Loading profile…</p>
          }
        >
          <Profile userId={userId} />
        </Suspense>
      </div>
    </main>
  );
}
