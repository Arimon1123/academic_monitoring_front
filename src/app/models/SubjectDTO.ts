import { RequirementDTO } from "./RequirementDTO";

export interface SubjectDTO {
    id: number | null;
    name: string;
    hours: number;
    gradeId: number;
    requirements: RequirementDTO[];
}