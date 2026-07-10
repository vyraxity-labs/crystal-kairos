import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import path from 'path'

// Load env variables
dotenv.config({ path: path.join(process.cwd(), '.env') })

const cleanEnvVar = (val: string | undefined): string => {
  if (!val) return ''
  return val.replace(/^["']|["']$/g, '').trim()
}

const cloudName = cleanEnvVar(process.env.CLOUDINARY_CLOUD_NAME)
const apiKey = cleanEnvVar(process.env.CLOUDINARY_API_KEY)
const apiSecret = cleanEnvVar(process.env.CLOUDINARY_API_SECRET)

console.log('🔄 Diagnostic credentials check:')
console.log('Cloud Name:', cloudName)
console.log('API Key:', apiKey)
console.log('API Secret (first 3 chars):', apiSecret.substring(0, 3) + '...')

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
})

async function testUpload() {
  console.log('\n🔄 Attempting signed Cloudinary test upload...')
  const buffer = Buffer.from('Diagnostic test file content for Crystal Kairos Ajo Portal', 'utf8')
  
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'crystal-kairos/diagnostics',
          resource_type: 'raw',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    })
    console.log('✅ Diagnostic upload SUCCESSFUL!')
    console.log('Result:', result)
  } catch (err: any) {
    console.error('❌ Cloudinary upload failed!')
    console.error('Error Details:', {
      message: err.message,
      http_code: err.http_code,
      name: err.name,
      stack: err.stack,
      raw: err,
    })
  }
}

testUpload()
