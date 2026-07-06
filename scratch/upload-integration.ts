import { uploadReceipt } from '../lib/upload'
import fs from 'fs'
import path from 'path'

async function runTest() {
  console.log('🔄 Starting Receipt Upload & Secure Local Fallback Integration Test...')

  // 1. Prepare dummy data
  const mockContent = 'Proof of Payment: Member Ajo Contribution ₦10,000'
  const mockBuffer = Buffer.from(mockContent, 'utf-8')
  const mockFilename = 'test-payment-receipt.txt'

  // 2. Call uploadReceipt
  console.log('1. Uploading mock file...')
  const result = await uploadReceipt(mockBuffer, mockFilename)

  console.log('✅ Upload result:', result)

  if (!result.url) {
    throw new Error('Upload failed: No URL returned')
  }

  if (!result.isLocal) {
    throw new Error('Expected upload to be local since Cloudinary variables are not configured')
  }

  // 3. Extract filename and verify disk storage
  const filename = path.basename(result.url)
  const uploadsDir = path.join(process.cwd(), 'uploads')
  const filepath = path.join(uploadsDir, filename)

  console.log(`2. Verifying file on disk at: ${filepath}`)
  
  if (!fs.existsSync(filepath)) {
    throw new Error(`File was not found on disk at: ${filepath}`)
  }

  const fileContent = fs.readFileSync(filepath, 'utf-8')
  if (fileContent !== mockContent) {
    throw new Error(`File content mismatch! Expected: "${mockContent}", got: "${fileContent}"`)
  }

  console.log('✅ File verified on disk.')

  // Cleanup test file
  fs.unlinkSync(filepath)
  console.log('✅ Cleanup test file complete.')
  console.log('🎉 RECEIPT UPLOAD & SECURE LOCAL FALLBACK INTEGRATION TEST PASSED SUCCESSFULLY!')
}

runTest()
  .catch((err) => {
    console.error('❌ Integration Test Failed:', err)
    process.exit(1)
  })
