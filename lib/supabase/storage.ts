import { createClient } from "@/lib/supabase/client"

export async function uploadImage(
  file: File,
  bucket: string,
  folder: string
): Promise<string> {
  const supabase = createClient()

  // Generate unique filename
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  const filename = `${timestamp}-${random}-${file.name}`
  const path = `${folder}/${filename}`

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicData.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

export async function deleteImage(bucket: string, path: string): Promise<void> {
  const supabase = createClient()

  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}
