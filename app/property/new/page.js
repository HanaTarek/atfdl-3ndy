import Image from "next/image";
import NewPropertyForm from "@/components/property/NewPropertyForm";
import backgroundImg from "@/assets/new-background.jpg";
import { createClient } from "@/util/supabase/server-client";
import SignInForm from "@/components/auth/Signinform";
import { redirect } from "next/navigation";


export  default async function NewPropertyPage() {

    const supabase = await createClient();

    let user = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user ?? null;
    } catch {
      user = null;
    }

    if (!user) {
      redirect("/login?next=/property/new");
    }
//     const supabase = await createClient();
//     const { data } = await supabase.auth.getUser();
//     const user = data?.claims ?? null;
//     console.log("user in new prop page: " , user);
//     // console.log("userID in new prop page: ", user.id);
//     const { data2, error } = await supabase.auth.getUser();
//     console.log("getUser data:", data2, "error:", error);
//     const { datasesssion, errorsesssion } = await supabase.auth.getSession();
//     console.log("getSession data:", datasesssion, "error:", errorsesssion);



// if (!user) {
//   return (
//     <>
//       <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 pt-28 pb-16">
//         <Image
//           src={backgroundImg}
//           alt=""
//           fill
//           priority
//           className="object-cover"
//         />
//         <div className="absolute inset-0 bg-[#17110C]/70" />

//         <div className="relative z-10 mx-auto w-full max-w-md p-6 shadow-2xl shadow-black/40 md:p-8">
//           <h1 className="mt-2 text-2xl font-semibold text-[#FBDFC5] md:text-3xl mb-4">
//             Sign In To become a Host
//           </h1>
//           <SignInForm />
//         </div>
//       </main>
//     </>
//   );
// }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 pt-28 pb-16">
      {/* Background image layer */}
      <Image
        src={backgroundImg}
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#17110C]/70" />

      {/* Glass card — header + form together */}
      <div className="relative z-10 mx-auto w-full max-w-2xl rounded-[1.75rem] border border-[#FBDFC5]/10 bg-[#1f1710]/40 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-8">
        <span className="text-xs font-bold uppercase tracking-[2.5px] text-[#CA6200]">
          Become a host
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-[#FBDFC5] md:text-3xl">
          List your place
        </h1>
        <p className="mt-1 text-sm text-[#FBDFC5]/50">
          Tell guests what makes it worth the trip.
        </p>

        <NewPropertyForm  user={user}/>
      </div>
    </main>
  );
}
