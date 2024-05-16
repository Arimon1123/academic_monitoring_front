import { ParentDTO } from './ParentDTO';
import { TeacherDTO } from './TeacherDTO';
import { AdministrativeDTO } from './AdministrativeDTO';
import { UserDTO } from './UserDTO';
import { StudentDTO } from './StudentDTO';
import { AssignationDTO } from './AssignationDTO';

export interface UserDetailsDTO {
  details: ParentDTO | TeacherDTO | AdministrativeDTO;
  studentDetails: StudentDTO;
  user: UserDTO;
  students: StudentDTO[];
  classAssignations: AssignationDTO[];
  role: string;
}
