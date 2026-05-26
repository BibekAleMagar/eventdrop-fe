export interface DriveStorageQuotaResponse {
  user: {
    name: string | null | undefined;
    email: string | null | undefined;
    photoUrl: string | null | undefined;
  };
  storage: {
    totalBytes: number;
    usedBytes: number;
    usedInDriveBytes: number;
    usedInTrashBytes: number;
    freeBytes: number | null;
    usedPercent: number | null;
    total: string;
    used: string;
    usedInDrive: string;
    usedInTrash: string;
    free: string;
  };
}