export interface ScheduleCreateDTO {
    start: string;
    end: string;
    isAvailable: boolean;
    reason: string;
    period: number;

}