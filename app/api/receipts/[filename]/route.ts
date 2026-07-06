import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // 1. Authenticate user session
    const session = await auth()
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { filename } = await params
    if (!filename) {
      return new NextResponse('Filename is required', { status: 400 })
    }

    // 2. Prevent path traversal vulnerability by resolving path and verifying bounds
    const uploadsDir = path.join(process.cwd(), 'uploads')
    const safeFilePath = path.resolve(uploadsDir, filename)

    if (!safeFilePath.startsWith(uploadsDir)) {
      return new NextResponse('Access Denied', { status: 403 })
    }

    // 3. Check if file exists
    if (!fs.existsSync(safeFilePath)) {
      return new NextResponse('File Not Found', { status: 404 })
    }

    // 4. Resolve Content-Type
    let contentType = 'application/octet-stream'
    const ext = path.extname(filename).toLowerCase()
    if (ext === '.pdf') {
      contentType = 'application/pdf'
    } else if (ext === '.png') {
      contentType = 'image/png'
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg'
    }

    // 5. Read file and return as response stream
    const fileBuffer = fs.readFileSync(safeFilePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Secure receipts API error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
