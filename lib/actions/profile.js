"use server";


export async function updateProfileAction(formValues) {
  console.log("updateProfileAction called with:", formValues);
  return { success: true };
}
