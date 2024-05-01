export interface AttendanceReportDTO {
  attendance: number;
  count: number;
  classes: number;
  subjects: number;
  attendanceType: number;
  year: number;
  shift: number;
  section: string;
  gradeNumber: number;
  identifier: string;
  date: Date;
}
