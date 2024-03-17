import { PersonDTO } from "./PersonDTO";

export interface TeacherDTO {
    id: number;
    person: PersonDTO;
    academicEmail: String;
}