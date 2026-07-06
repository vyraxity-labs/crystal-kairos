import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const writeFileAsync = promisify(fs.writeFile)
const mkdirAsync = promisify(fs.mkdir)

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

/**
 * Uploads a file buffer to Cloudinary or falls back to local disk storage.
 * Returns the URL (secure_url from Cloudinary or local endpoint URL).
 */
export async function uploadReceipt(
  file: Buffer,
  filename: string
): Promise<{ url: string; publicId?: string; isLocal: boolean }> {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'crystal-kairos/receipts',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(error)
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              isLocal: false,
            })
          } else {
            reject(new Error('Unknown upload result'))
          }
        }
      )

      uploadStream.end(file)
    })
  } else {
    // Local fallback: save to /uploads/ directory
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      await mkdirAsync(uploadsDir, { recursive: true })
    }

    const uniqueFilename = `${Date.now()}-${filename}`
    const filepath = path.join(uploadsDir, uniqueFilename)
    await writeFileAsync(filepath, file)

    console.log(`Saved file locally: ${filepath}`)

    return {
      url: `/api/receipts/${uniqueFilename}`,
      isLocal: true,
    }
  }
}
