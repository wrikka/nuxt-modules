export interface CompressionOptions {
  level?: number // 0-9, where 9 is maximum compression
  onProgress?: (current: number, total: number) => void
}

export interface CompressedArchive {
  blob: Blob
  fileName: string
  size: number
  originalSize: number
  files: string[]
  compressionRatio: number
}

export async function createZipArchive(
  files: File[],
  archiveName: string = `archive_${Date.now()}.zip`,
  options: CompressionOptions = {}
): Promise<CompressedArchive> {
  const { level = 6, onProgress } = options

  if (files.length === 0) {
    throw new Error('No files to compress')
  }

  // Simple ZIP implementation using JSZip-style approach
  // For production, you might want to use a library like fflate or jszip
  const originalSize = files.reduce((sum, f) => sum + f.size, 0)

  // Create a minimal ZIP structure
  const zipParts: Uint8Array[] = []
  const fileHeaders: { offset: number; crc: number; compressed: Uint8Array; name: string; size: number }[] = []

  let currentOffset = 0

  // Local file headers and data
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const content = new Uint8Array(await file.arrayBuffer())

    // Simple "stored" compression (no actual compression for simplicity)
    // In production, you'd use DEFLATE here
    const compressed = content

    // Calculate CRC32
    const crc = calculateCRC32(content)

    const nameBytes = new TextEncoder().encode(file.name)

    // Local file header
    const localHeader = new Uint8Array(30 + nameBytes.length)
    const view = new DataView(localHeader.buffer)

    // Local file header signature
    view.setUint32(0, 0x04034b50, true)
    // Version needed to extract
    view.setUint16(4, 20, true)
    // General purpose bit flag
    view.setUint16(6, 0, true)
    // Compression method (0 = stored)
    view.setUint16(8, 0, true)
    // File last modification time and date (placeholder)
    view.setUint16(10, 0, true)
    view.setUint16(12, 0, true)
    // CRC-32
    view.setUint32(14, crc, true)
    // Compressed size
    view.setUint32(18, compressed.length, true)
    // Uncompressed size
    view.setUint32(22, content.length, true)
    // File name length
    view.setUint16(26, nameBytes.length, true)
    // Extra field length
    view.setUint16(28, 0, true)
    // File name
    localHeader.set(nameBytes, 30)

    fileHeaders.push({
      offset: currentOffset,
      crc,
      compressed,
      name: file.name,
      size: content.length
    })

    zipParts.push(localHeader)
    currentOffset += localHeader.length

    zipParts.push(compressed)
    currentOffset += compressed.length

    onProgress?.(i + 1, files.length * 2)
  }

  // Central directory
  const centralDirStart = currentOffset
  for (let i = 0; i < files.length; i++) {
    const header = fileHeaders[i]
    const nameBytes = new TextEncoder().encode(header.name)

    const centralHeader = new Uint8Array(46 + nameBytes.length)
    const view = new DataView(centralHeader.buffer)

    // Central directory signature
    view.setUint32(0, 0x02014b50, true)
    // Version made by
    view.setUint16(4, 20, true)
    // Version needed to extract
    view.setUint16(6, 20, true)
    // General purpose bit flag
    view.setUint16(8, 0, true)
    // Compression method
    view.setUint16(10, 0, true)
    // File last modification time and date
    view.setUint16(12, 0, true)
    view.setUint16(14, 0, true)
    // CRC-32
    view.setUint32(16, header.crc, true)
    // Compressed size
    view.setUint32(20, header.compressed.length, true)
    // Uncompressed size
    view.setUint32(24, header.size, true)
    // File name length
    view.setUint16(28, nameBytes.length, true)
    // Extra field length
    view.setUint16(30, 0, true)
    // File comment length
    view.setUint16(32, 0, true)
    // Disk number start
    view.setUint16(34, 0, true)
    // Internal file attributes
    view.setUint16(36, 0, true)
    // External file attributes
    view.setUint32(38, 0, true)
    // Relative offset of local header
    view.setUint32(42, header.offset, true)
    // File name
    centralHeader.set(nameBytes, 46)

    zipParts.push(centralHeader)
    currentOffset += centralHeader.length

    onProgress?.(files.length + i + 1, files.length * 2)
  }

  // End of central directory record
  const centralDirSize = currentOffset - centralDirStart
  const endRecord = new Uint8Array(22)
  const endView = new DataView(endRecord.buffer)

  // End of central directory signature
  endView.setUint32(0, 0x06054b50, true)
  // Number of this disk
  endView.setUint16(4, 0, true)
  // Disk with central directory
  endView.setUint16(6, 0, true)
  // Number of entries on this disk
  endView.setUint16(8, files.length, true)
  // Total number of entries
  endView.setUint16(10, files.length, true)
  // Size of central directory
  endView.setUint32(12, centralDirSize, true)
  // Offset of start of central directory
  endView.setUint32(16, centralDirStart, true)
  // Comment length
  endView.setUint16(20, 0, true)

  zipParts.push(endRecord)

  // Combine all parts
  const totalLength = zipParts.reduce((sum, part) => sum + part.length, 0)
  const zipData = new Uint8Array(totalLength)
  let position = 0
  for (const part of zipParts) {
    zipData.set(part, position)
    position += part.length
  }

  const blob = new Blob([zipData], { type: 'application/zip' })

  return {
    blob,
    fileName: archiveName,
    size: blob.size,
    originalSize,
    files: fileHeaders.map(h => h.name),
    compressionRatio: originalSize > 0 ? (1 - blob.size / originalSize) * 100 : 0
  }
}

function calculateCRC32(data: Uint8Array): number {
  // CRC32 lookup table
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    }
    table[i] = c
  }

  let crc = 0xFFFFFFFF
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8)
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

export function estimateCompressionRatio(files: File[]): number {
  // Estimate based on file types
  const textTypes = ['text/', 'application/json', 'application/xml', 'application/javascript']
  let textSize = 0
  let totalSize = 0

  for (const file of files) {
    totalSize += file.size
    if (textTypes.some(type => file.type.includes(type))) {
      textSize += file.size
    }
  }

  if (totalSize === 0) return 0

  // Text files compress well (~70%), binary files less (~10%)
  const textRatio = textSize / totalSize
  return textRatio * 70 + (1 - textRatio) * 10
}
