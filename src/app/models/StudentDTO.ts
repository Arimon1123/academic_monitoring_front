import { UserDTO } from './UserDTO';
import { ParentDTO } from './ParentDTO';

export interface StudentDTO {
  id: number;
  name: string;
  ci: string;
  fatherLastname: string;
  motherLastname: string;
  birthDate: string;
  address: string;
  rude: string;
  studentClass: string;
  email: string;
  user: UserDTO;
  parents: ParentDTO[];
}
