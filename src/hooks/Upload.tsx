import { useCreateFormData } from "../api/apiHelper";

export const useUploadPhoto = () => {
  return useCreateFormData<
    { eventCode: string; photo: { uri: string; name: string; type: string } },
    { success: boolean }
  >("upload");
};
