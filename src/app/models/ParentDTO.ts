import { PersonDTO } from './PersonDTO';

export interface ParentDTO {
  id: number;
  person: PersonDTO;
  status: number;
}
