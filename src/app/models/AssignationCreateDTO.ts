import { ScheduleDTO } from './ScheduleDTO';

export interface AssignationCreateDTO {
  classId: number;
  classroomId: number;
  subjectId: number;
  teacherId: number;
  schedule: ScheduleDTO[];
}
