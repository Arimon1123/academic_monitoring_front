import { PersonDTO } from './PersonDTO';
import { SubjectDTO } from './SubjectDTO';

export interface TeacherDTO {
  id: number;
  person: PersonDTO;
  academicEmail: string;
  subjects: SubjectDTO[];
}
