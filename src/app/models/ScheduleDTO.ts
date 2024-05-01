export interface ScheduleDTO {
  id: number | null;
  weekday: string;
  startTime: string;
  endTime: string;
  period: number;
}
