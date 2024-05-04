import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ResponseDTO } from '../models/ResponseDTO';
import { ScheduleDTO } from '../models/ScheduleDTO';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}
  getScheduleByClassroom(id: number) {
    return this.http.get<ResponseDTO<ScheduleDTO[]>>(
      `${this.API_URL}/schedule/classroom/${id}`,
      { withCredentials: true }
    );
  }
  getScheduleByTeacher(id: number) {
    return this.http.get<ResponseDTO<ScheduleDTO[]>>(
      `${this.API_URL}/schedule/teacher/${id}`,
      { withCredentials: true }
    );
  }
  getScheduleByClass(id: number) {
    return this.http.get<ResponseDTO<ScheduleDTO[]>>(
      `${this.API_URL}/schedule/class/${id}`,
      { withCredentials: true }
    );
  }
  getScheduleBySubjectAndClassId(classId: number, subjectId: number) {
    return this.http.get<ResponseDTO<ScheduleDTO[]>>(
      `${this.API_URL}/schedule/class/${classId}/subject/${subjectId}`,
      { withCredentials: true }
    );
  }
  getTeacherConsultHours(teacherId: number) {
    return this.http.get<ResponseDTO<ScheduleDTO[]>>(
      `${this.API_URL}/schedule/teacher/${teacherId}/consultHours`,
      {
        withCredentials: true,
      }
    );
  }
}
