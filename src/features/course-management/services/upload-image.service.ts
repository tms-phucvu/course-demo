import { apiClient } from "@/core/lib";

export interface UploadResponse {
  url: string;
  key: string;
}

export const uploadImage = async (file: File) => {
  const formData = new FormData();

  formData.append("type", "image");
  formData.append("file", file);

  const res = await apiClient.post<UploadResponse>("/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
