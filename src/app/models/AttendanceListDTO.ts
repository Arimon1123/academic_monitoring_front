import { StudentDTO } from './StudentDTO';
import { AttendanceDTO } from './AttendanceDTO';

export interface AttendanceListDTO {
  student: StudentDTO;
  attendance: AttendanceDTO[];
}
