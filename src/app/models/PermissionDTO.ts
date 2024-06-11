import { StudentDTO } from './StudentDTO';

export interface PermissionDTO {
  id: number;
  date: Date;
  permissionStartDate: Date;
  permissionEndDate: Date;
  reason: string;
  permissionStatus: number;
  images: string[];
  student: StudentDTO;
  rejection: { id: number; reason: string; permissionId: number }[];
}
