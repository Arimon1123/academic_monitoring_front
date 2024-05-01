import { StudentDTO } from './StudentDTO';
import { ImageDTO } from './ImageDTO';

export interface PermissionDTO {
  id: number;
  date: Date;
  permissionStartDate: Date;
  permissionEndDate: Date;
  reason: string;
  permissionStatus: number;
  images: ImageDTO[];
  student: StudentDTO;
}
