import pool from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FOLDERS = new Set(["banners", "categories", "products", "shapes", "general"]);

export async function storeImage(file: File, requestedFolder: string) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Images must be 10 MB or smaller.");
  }

  const folder = ALLOWED_FOLDERS.has(requestedFolder)
    ? requestedFolder
    : "general";
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploaded = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `sr-art-more/${folder}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary did not return an upload result."));
            return;
          }

          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      );

      stream.end(buffer);
    }
  );

  const result = await pool.query(
    `
      INSERT INTO images
        (file_name, original_name, storage_provider, url, public_id, folder, size, mime_type)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
    [
      uploaded.public_id.split("/").pop(),
      file.name,
      "Cloudinary",
      uploaded.secure_url,
      uploaded.public_id,
      folder,
      file.size,
      file.type,
    ]
  );

  return result.rows[0];
}

export function imageProxyPath(imageId: number) {
  return `/api/images/${imageId}`;
}
