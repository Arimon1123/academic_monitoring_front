import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { AttendanceReportDTO } from '../models/AttendanceReportDTO';
import { GradeRangeReportDTO } from '../models/GradeRangeReportDTO';
import { PerformanceReportDTO } from '../models/PerformanceReportDTO';
import { ResponseDTO } from '../models/ResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getAttendanceReport(startDate: string, endDate: string, gradeId: number) {
    return this.http.get<ResponseDTO<AttendanceReportDTO[]>>(
      `${this.API_URL}/report/attendance`,
      {
        params: { startDate: startDate, endDate: endDate, gradeId: gradeId },
        withCredentials: true,
      }
    );
  }

  getPerformanceReport(gradeId: number, year: number) {
    return this.http.get<ResponseDTO<PerformanceReportDTO[]>>(
      `${this.API_URL}/report/performance`,
      { params: { gradeId: gradeId, year: year }, withCredentials: true }
    );
  }
  getGradeRangeReport(bimester: number, gradeId: number, year: number) {
    return this.http.get<ResponseDTO<GradeRangeReportDTO[]>>(
      `${this.API_URL}/report/gradeRange`,
      {
        params: { bimester: bimester, gradeId: gradeId, year: year },
        withCredentials: true,
      }
    );
  }
}
