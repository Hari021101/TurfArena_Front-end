import { Platform } from "react-native";

/**
 * Cloudinary service for image uploads
 */

/**
 * Upload an image to Cloudinary using unsigned upload
 * @param uri - Local image URI
 * @returns Promise<string | null> - Cloudinary URL or null
 */
export const uploadToCloudinary = async (
  uri: string,
): Promise<string | null> => {
  try {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("❌ Cloudinary config missing in process.env", {
        cloudName,
        uploadPreset,
      });
      return null;
    }

    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const data = new FormData();

    if (Platform.OS === "web") {
      // On web, fetch the blob first
      const response = await fetch(uri);
      const blob = await response.blob();
      data.append("file", blob);
    } else {
      // On mobile, use the standard RN object structure
      const filename = uri.split("/").pop() || "upload.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      data.append("file", {
        uri: uri,
        name: filename,
        type: type,
      } as any);
    }

    data.append("upload_preset", uploadPreset);
    data.append("folder", "turf-arena");

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (result.secure_url) {
      console.log("✅ Image uploaded to Cloudinary:", result.secure_url);
      return result.secure_url;
    } else {
      console.error(
        "❌ Cloudinary upload error:",
        result.error?.message || result,
      );
      return null;
    }
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error);
    return null;
  }
};
