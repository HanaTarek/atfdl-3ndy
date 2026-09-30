import SignInForm from "@/components/auth/Signinform";
import backgroundImg from "@/assets/new-background.jpg";
import Image from "next/image";

export default async function SignUpPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : "/";

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 pt-28 pb-16">
      <Image
        src={backgroundImg}
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#17110C]/70" />
      <SignInForm next={next} />
    </main>
  );
}
