import { RoleDTO } from './RoleDTO';

export interface UserDTO {
  id: number;
  username: string;
  password: string;
  role: RoleDTO[];
  status: number;
}
