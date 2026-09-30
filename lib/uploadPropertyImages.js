"use client";

import imageCompression from "browser-image-compression";
import { createClient } from "@/util/supabase/browser-client";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 2000,
  useWebWorker: true,
  fileType: "image/webp",
};

export async function prepareImages(files) {
  const prepared = await Promise.all(
    files.map(async (file) => {
      const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
      // wrap the compressed Blob back into a File so it keeps a
      // name/type when appended to FormData
      return new File([compressed], `${crypto.randomUUID()}.webp`, {
        type: "image/webp",
      });
    }),
  );
  return prepared;
}
