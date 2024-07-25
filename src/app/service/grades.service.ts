import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { ResponseDTO } from '../models/ResponseDTO';
import { ActivityGradeDTO } from '../models/ActivityGradeDTO';
import { GradesDTO } from '../models/GradesDTO';

@Injectable({
  providedIn: 'root',
})
export class GradesService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getGradesByAssignation(assignationId: number, bimester: number) {
    return this.http.get<ResponseDTO<{ [key: number]: ActivityGradeDTO[] }>>(
      `${this.API_URL}/activityGrade/assignation/${assignationId}/bimester/${bimester}`,
      { withCredentials: true }
    );
  }
  saveGradesBy(activityGradeDTO: ActivityGradeDTO[]) {
    return this.http.post<ResponseDTO<string>>(
      `${this.API_URL}/activityGrade`,
      activityGradeDTO,
      { withCredentials: true }
    );
  }
  getGradesByStudentIdAndYear(studentId: number, year: number) {
    return this.http.get<ResponseDTO<{ [key: number]: GradesDTO[] }>>(
      `${this.API_URL}/grades`,
      { params: { studentId: studentId, year: year }, withCredentials: true }
    );
  }
  getGradesByStudentIdAndAssignationAndBimester(
    studentId: number,
    assignationId: number,
    bimester: number
  ) {
    return this.http.get<ResponseDTO<ActivityGradeDTO[]>>(
      `${this.API_URL}/grades/activities`,
      {
        params: {
          studentId: studentId,
          assignationId: assignationId,
          bimester: bimester,
        },
        withCredentials: true,
      }
    );
  }
}
