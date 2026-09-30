"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/util/supabase/server-client";
import { headers } from "next/headers";

export async function signUpNewUser(prevState, formData) {
  const fullName = formData.get("fullName");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const gender = formData.get("gender");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!fullName || !email || !phone || !password || !confirmPassword) {
    return { error: "Please fill in all required fields." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords don't match." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        gender: gender || null, // optional
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    error: null,
    success: true,
    message: "Check your email to confirm your account.",
  };
}

export async function signInAction(prevState, formData) {
  const next = formData.get("next");
  const email = formData.get("email");
  const password = formData.get("password");
 console.log("email: ", email, "password", password);
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const safeNext =
    typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/";

  redirect(safeNext);

}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}