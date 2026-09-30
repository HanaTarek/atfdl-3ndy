"use server";

import { createClient } from "@/util/supabase/server-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getProperty(PropertyID) {
  
  const supabase = await createClient();

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "approved")
    .eq("id", PropertyID)
    .single();    

  if (error) {
    throw new Error(`Failed to fetch property: ${error.message}`);
  }

  const imagePaths = Array.isArray(property.images) ? property.images : [];

  // Resolve every stored relative path into a full public URL
  const imageUrls = imagePaths.map((path) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from("property-images").getPublicUrl(path);
    return publicUrl;
  });

  const { data: hostData , error: hostError} = await supabase
  .from("profiles")
  .select("*")
  .eq("id" , property.host_id)
  .maybeSingle();

    if (hostError) {
      throw new Error(`Failed to fetch property: ${hostError.message}`);
    }

  return {
    ...property,
    images: imageUrls, 
    display_image: imageUrls[0] ?? null, 
    ...hostData
  };

}


export async function getProperties() {

  const supabase = await createClient();

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "approved");

  if (error) {
    throw new Error(`Failed to fetch properties: ${error.message}`);
  }

  const propertiesWithImages = properties.map((property) => {
    const imagePaths = Array.isArray(property.images) ? property.images : [];

    // Resolve every stored relative path into a full public URL
    const imageUrls = imagePaths.map((path) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("property-images").getPublicUrl(path);
      return publicUrl;
    });

    return {
      ...property,
      images: imageUrls, // full URLs, ready for <Image src=...>
      display_image: imageUrls[0] ?? null, // convenience field for card views
    };
  });

  return propertiesWithImages;
}




const MAX_IMAGES = 15;
const MAX_IMAGE_SIZE_MB = 5;

// Basic sanity checks on the raw files — real gatekeeping (compression,
// resizing) already happened client-side, but never trust that alone
// since someone could call this action directly, bypassing the client.
function validateImageFiles(files) {
  console.log("filess in validateImageFiles " , files);
  const errors = [];
  
  if (!files || files.length === 0) {
    errors.push("Please upload at least one photo.");
    return errors;
  }
  if (files.length > MAX_IMAGES) {
    errors.push(`You can upload up to ${MAX_IMAGES} photos.`);
  }
  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) {
      errors.push("One or more uploaded files is invalid.");
      break;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      errors.push(`Each image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      break;
    }
  }

  return errors;
}

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 2000;
const VALID_CATEGORIES = [
  "Farm",
  "Camping",
  "Mountain",
  "Cabin",
  "Treehouse",
  "Beach",
  "Desert",
  "Glamping",
  "Houseboat",
  "Villa",
  "Tiny House",
];

// Returns an array of error messages (empty array if everything is valid).
function validateProperty(property) {
  const errors = [];

  // Title — schema: between 3 and 100 chars
  if (
    !property.title ||
    typeof property.title !== "string" ||
    !property.title.trim()
  ) {
    errors.push("Title is required.");
  } else if (
    property.title.trim().length < 3 ||
    property.title.trim().length > MAX_TITLE_LENGTH
  ) {
    errors.push(`Title must be between 3 and ${MAX_TITLE_LENGTH} characters.`);
  }

  // Description — schema: between 20 and 2000 chars
  if (!property.description || !property.description.trim()) {
    errors.push("Description is required.");
  } else if (
    property.description.trim().length < 20 ||
    property.description.trim().length > MAX_DESCRIPTION_LENGTH
  ) {
    errors.push(
      `Description must be between 20 and ${MAX_DESCRIPTION_LENGTH} characters.`,
    );
  }

  // Category — must match schema's check constraint list
  if (!property.category || !VALID_CATEGORIES.includes(property.category)) {
    errors.push("Please select a valid category.");
  }

  // Location — schema: not null
  if (!property.location || !property.location.trim()) {
    errors.push("Please select a location on the map.");
  }

  // Country — schema: not null
  if (!property.country || !property.country.trim()) {
    errors.push(
      "Country could not be determined — please reselect on the map.",
    );
  }

  // Latitude — schema: numeric(9,6), nullable, but validate range if present
  if (property.latitude !== null && property.latitude !== "") {
    const lat = Number(property.latitude);
    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
      errors.push("Invalid latitude — please pick a location on the map.");
    }
  }

  // Longitude — schema: numeric(9,6), nullable, but validate range if present
  if (property.longitude !== null && property.longitude !== "") {
    const lng = Number(property.longitude);
    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
      errors.push("Invalid longitude — please pick a location on the map.");
    }
  }

  // Price per night — schema: >= 0 (zero is valid)
  const price = Number(property.price_per_night);
  if (
    property.price_per_night === null ||
    property.price_per_night === "" ||
    Number.isNaN(price)
  ) {
    errors.push("Price per night is required.");
  } else if (price < 0) {
    errors.push("Price per night cannot be negative.");
  }

  // Guests — schema: > 0 (strictly positive, unlike the others)
  const guests = Number(property.guests);
  if (
    property.guests === null ||
    property.guests === "" ||
    Number.isNaN(guests)
  ) {
    errors.push("Guests is required.");
  } else if (!Number.isInteger(guests) || guests <= 0) {
    errors.push("Guests must be a whole number greater than 0.");
  }

  // Bedrooms, Beds, Baths — schema: >= 0 (zero allowed)
  const zeroOrMoreFields = {
    Bedrooms: property.bedrooms,
    Beds: property.beds,
    Baths: property.baths,
  };
  for (const [label, value] of Object.entries(zeroOrMoreFields)) {
    const num = Number(value);
    if (value === null || value === "" || Number.isNaN(num)) {
      errors.push(`${label} is required.`);
    } else if (!Number.isInteger(num) || num < 0) {
      errors.push(`${label} must be a whole number that is 0 or greater.`);
    }
  }


  return errors;
}

async function uploadImages(supabase, files, userId) {
  console.log("filess in uploadImages ", files);
  console.log("userId in uploadImages ", userId);

  const uploadedPaths = [];

  try {
    for (const file of files) {
      const filePath = `${userId}/${Date.now()}-${crypto.randomUUID()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file, {
          contentType: "image/webp",
          cacheControl: "3600",
        });

      if (uploadError) {
        throw new Error(`Failed to upload an image: ${uploadError.message}`);
      }

      uploadedPaths.push(filePath);
    }

    return { paths: uploadedPaths };
  } catch (err) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from("property-images").remove(uploadedPaths);
    }
    return { error: err.message };
  }
}

export async function createPropertyAction(prevState, formData) {

  const supabase = await createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    user = null;
  }
  console.log("user in the property ,,, user: ", user);

  // console.log("user in the property" , user)

  console.log("user in the property getUser()", await supabase.auth.getUser());

  if (!user) {
    return { error: ["You must be signed in to list a property."] };
  }

  const property = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    location: formData.get("locationName"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    country: formData.get("country"),
    price_per_night: formData.get("pricePerNight"),
    guests: formData.get("guests"),
    bedrooms: formData.get("bedrooms"),
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    amenities: formData.getAll("amenities"),
    images: formData.getAll("imageUrls"), // already-hosted URLs, no upload needed here
  };
  const photoFiles = formData.getAll("photos");

  // Validate everything BEFORE touching Storage — no upload happens
  // unless the rest of the form is already valid.
  const fieldErrors = validateProperty(property);
  const imageErrors = validateImageFiles(photoFiles);
  const errors = [...fieldErrors, ...imageErrors];

  if (errors.length > 0) {
    return { error: errors, values: property };
  }

  // Fields are valid — now, and only now, upload images.
    const { paths, error: uploadError } = await uploadImages(
      supabase,
      photoFiles,
      user.id,
    );
    if (uploadError) {
      return { error: [uploadError], values: property };
    }

  const insertPayload = {
    host_id: user.id,
    title: property.title.trim(),
    description: property.description.trim(),
    category: property.category,
    location: property.location.trim(),
    country: property.country.trim(),
    latitude: property.latitude ? Number(property.latitude) : null,
    longitude: property.longitude ? Number(property.longitude) : null,
    price_per_night: Number(property.price_per_night),
    guests: Number(property.guests),
    bedrooms: Number(property.bedrooms),
    beds: Number(property.beds),
    baths: Number(property.baths),
    amenities: property.amenities,
    images: paths,
  };

  const { error } = await supabase.from("properties").insert(insertPayload);

    if (error) {
    // Insert failed after a successful upload — clean the images back out
    if (paths.length > 0) {
      await supabase.storage.from("property-images").remove(paths);
    }
    return { error: [error.message], values: property };
  }

  revalidatePath("/property", "layout");
  redirect("/property");
}