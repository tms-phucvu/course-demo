import { uploadImage } from "@/features/course-management/services/upload-image.service";
import { useMutation } from "@tanstack/react-query";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImage,
  });
};
