import { useFetch } from "../api/apiHelper";
import { DriveStorageQuotaResponse } from "../types/Setting";

export const useDashboard = () => {
  return useFetch<DriveStorageQuotaResponse>(["dashboard"], "/drive/quota");
};
