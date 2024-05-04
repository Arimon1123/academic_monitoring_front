import { RequirementDTO } from './RequirementDTO';

export interface SubjectDTO {
  id: number;
  name: string;
  hours: number;
  gradeId: number;
  status: number;
  gradeName: string;
  section: string;
  requirements: RequirementDTO[];
}
