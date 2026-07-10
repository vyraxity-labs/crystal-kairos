import { v2 as cloudinary } from 'cloudinary'

// Helper to strip leading/trailing quotes from environment variables if present
// const cleanEnvVar = (val: string | undefined): string => {
//   if (!val) return ''
//   return val.replace(/^["']|["']$/g, '').trim()
// }

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret)

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

/**
 * Uploads a file buffer strictly to Cloudinary.
 * Returns the secure url from Cloudinary.
 * If Cloudinary is not configured or the upload fails, it throws an error immediately.
 * No local disk fallback is applied to prevent server storage accumulation issues.
 */
export async function uploadReceipt(
  file: Buffer,
  filename: string,
): Promise<{ url: string; publicId: string; isLocal: boolean }> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured in environment variables. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.',
    )
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'crystal-kairos/receipts',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload stream error:', error)
          reject(error)
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            isLocal: false,
          })
        } else {
          reject(new Error('Unknown Cloudinary upload result'))
        }
      },
    )

    uploadStream.end(file)
  })
}
