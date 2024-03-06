import { PersonDTO } from "./PersonDTO";

export interface ParentDTO {
    parentId: number;
    person: PersonDTO;
    status: number;
}