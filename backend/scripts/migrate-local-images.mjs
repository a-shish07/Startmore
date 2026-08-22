import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";
import { v2 as cloudinary } from "cloudinary";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function upload(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `sr-art-more/${folder}`, resource_type: "image" },
      (error, result) => (error || !result ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

const images = await pool.query(
  "SELECT id, url, folder FROM images WHERE url LIKE '/uploads/%' ORDER BY id"
);
let migrated = 0;
let missing = 0;

async function localBuffer(url) {
  const relativePath = url.replace(/^\/+/, "");
  const localPath = path.join(
    process.cwd(),
    "public",
    relativePath.replace(/^uploads[\\/]/, "uploads/")
  );
  await access(localPath);
  return { buffer: await readFile(localPath), localPath };
}

for (const image of images.rows) {
  try {
    const { buffer } = await localBuffer(image.url);
    const result = await upload(buffer, image.folder || "general");
    await pool.query(
      `UPDATE images
       SET url = $1, public_id = $2, storage_provider = 'Cloudinary'
       WHERE id = $3`,
      [result.secure_url, result.public_id, image.id]
    );
    migrated += 1;
    console.log(`Migrated image ${image.id}`);
  } catch {
    missing += 1;
    console.warn(`Skipping image ${image.id}: local file was not found.`);
    continue;
  }
}

const banners = await pool.query(
  "SELECT id, image_url FROM hero_banners WHERE image_url LIKE '/uploads/%' ORDER BY id"
);

for (const banner of banners.rows) {
  try {
    const { buffer, localPath } = await localBuffer(banner.image_url);
    const result = await upload(buffer, "banners");
    const image = await pool.query(
      `INSERT INTO images
        (file_name, original_name, storage_provider, url, public_id, folder, size, mime_type)
       VALUES ($1, $2, 'Cloudinary', $3, $4, 'banners', $5, 'image/*')
       RETURNING id`,
      [path.basename(localPath), path.basename(localPath), result.secure_url, result.public_id, buffer.length]
    );
    await pool.query(
      "UPDATE hero_banners SET image_url = $1 WHERE id = $2",
      [`/api/images/${image.rows[0].id}`, banner.id]
    );
    migrated += 1;
    console.log(`Migrated banner ${banner.id}`);
  } catch {
    missing += 1;
    console.warn(`Skipping banner ${banner.id}: local file was not found.`);
  }
}

await pool.end();
console.log(`Migration complete: ${migrated} migrated, ${missing} skipped.`);
