import { RoleDTO } from "./RoleDTO";

export interface UserCreateDTO {
    id?: number;
    name?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    username?: string;
    ci?: string;
    address?: string;
    roles?: RoleDTO[];
}