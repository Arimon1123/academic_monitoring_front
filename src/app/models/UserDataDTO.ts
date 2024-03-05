import { RoleDTO } from "./RoleDTO";

export interface UserDataDTO {
    id: number;
    name: string;
    lastname: string;
    ci: string;
    email: string;
    phone: string;
    address: string;
    username: string;
    roles: RoleDTO[];
    imageUrl: string;
    status: number;
} 