"use client"

import { useState, useCallback } from "react"

interface UploadedFile {
  name: string
  url: string
  type: string
  size: number
}

interface UseFileUploadOptions {
  maxSize?: number // in bytes
  acceptedTypes?: string[]
  onUploadComplete?: (files: UploadedFile[]) => void
  onError?: (error: string) => void
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024 // 10MB
const DEFAULT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
]

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSize = DEFAULT_MAX_SIZE,
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
    onUploadComplete,
    onError,
  } = options

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File "${file.name}" quá lớn. Giới hạn: ${(maxSize / 1024 / 1024).toFixed(1)}MB`
      }

      if (!acceptedTypes.includes(file.type)) {
        return `File "${file.name}" không được hỗ trợ. Định dạng hợp lệ: ${acceptedTypes.join(", ")}`
      }

      return null
    },
    [maxSize, acceptedTypes]
  )

  const uploadFiles = useCallback(
    async (files: FileList | File[]): Promise<UploadedFile[]> => {
      const fileArray = Array.from(files)
      const results: UploadedFile[] = []

      // Validate all files first
      for (const file of fileArray) {
        const error = validateFile(file)
        if (error) {
          onError?.(error)
          return []
        }
      }

      setIsUploading(true)
      setUploadProgress(0)

      try {
        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i]
          
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`Upload failed for ${file.name}`)
          }

          const data = await response.json()
          
          const uploadedFile: UploadedFile = {
            name: file.name,
            url: data.url,
            type: getFileType(file.type),
            size: file.size,
          }

          results.push(uploadedFile)
          setUploadProgress(((i + 1) / fileArray.length) * 100)
        }

        setUploadedFiles((prev) => [...prev, ...results])
        onUploadComplete?.(results)
        
        return results
      } catch (error) {
        onError?.((error as Error).message)
        return []
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    },
    [validateFile, onUploadComplete, onError]
  )

  const removeFile = useCallback((fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName))
  }, [])

  const clearFiles = useCallback(() => {
    setUploadedFiles([])
  }, [])

  return {
    uploadFiles,
    removeFile,
    clearFiles,
    isUploading,
    uploadProgress,
    uploadedFiles,
    setUploadedFiles,
  }
}

function getFileType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType === "application/pdf") return "pdf"
  if (mimeType.includes("zip")) return "zip"
  return "file"
}

export default useFileUpload
