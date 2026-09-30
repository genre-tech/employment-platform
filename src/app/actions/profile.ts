"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();
  
  // Get the current logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const university = formData.get("university") as string;
  const degree = formData.get("degree") as string;
  const gradYear = parseInt(formData.get("gradYear") as string);
  const skills = formData.get("skills") as string;

  // Insert or update the profile
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id, // Primary key links to auth.users
      full_name: name,
      university,
      degree,
      expected_graduation_year: gradYear,
      core_capabilities: skills,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error saving profile:", error);
    throw new Error("Failed to save profile.");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
