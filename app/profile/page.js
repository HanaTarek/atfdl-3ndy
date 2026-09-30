import { createClient } from "@/util/supabase/server-client";
import { redirect } from "next/navigation";


export default async function Profile() {

  const supabase = await createClient();
  let user = null;

  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;

  } catch {
    user = null;
  }
   if (!user) redirect("/login");
  
   redirect(`/profile/${user.id}`);
   
  return(<></>);
}