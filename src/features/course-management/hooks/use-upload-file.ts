import { uploadFile } from "@/features/course-management/services/upload.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      toast.success("Image uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload image");
    },
  });
};
