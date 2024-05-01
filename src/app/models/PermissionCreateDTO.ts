export interface PermissionCreateDTO {
  id: number;
  date: string;
  permissionStartDate: string;
  permissionEndDate: string;
  reason: string;
  studentId: number;
}
