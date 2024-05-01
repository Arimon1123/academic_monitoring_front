import { PersonDTO } from './PersonDTO';

export interface AdministrativeDTO {
  id: number;
  person: PersonDTO;
  status: number;
}
