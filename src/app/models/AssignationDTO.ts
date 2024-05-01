import { ScheduleDTO } from './ScheduleDTO';

export interface AssignationDTO {
  id: number;
  className: string;
  subjectName: string;
  teacherName: string;
  classroomName: string;
  schedule: ScheduleDTO[];
}
