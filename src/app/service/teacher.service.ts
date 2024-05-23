import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { TeacherDTO } from '../models/TeacherDTO';
import { ResponseDTO } from '../models/ResponseDTO';
import { SubjectDTO } from '../models/SubjectDTO';
import { ScheduleDTO } from '../models/ScheduleDTO';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getTeachersBySubject(id: number) {
    return this.http.get<ResponseDTO<TeacherDTO[]>>(
      this.API_URL + '/teacher/subject/' + id,
      { withCredentials: true }
    );
  }
  getTeacherById(id: number) {
    return this.http.get<ResponseDTO<TeacherDTO>>(
      this.API_URL + '/teacher/' + id,
      { withCredentials: true }
    );
  }
  updateTeacherSubjects(teacherId: number, subjects: SubjectDTO[]) {
    return this.http.put(
      `${this.API_URL}/teacher/${teacherId}/subject`,
      subjects,
      { withCredentials: true }
    );
  }
  updateTeacherConsultHours(teacherId: number, consultHours: ScheduleDTO[]) {
    return this.http.put(
      `${this.API_URL}/teacher/${teacherId}/consultHours`,
      consultHours,
      { withCredentials: true }
    );
  }
  existsByAcademicEmail(email: string) {
    return this.http.get<ResponseDTO<boolean>>(
      `${this.API_URL}/teacher/exists/${email}`,
      {
        withCredentials: true,
      }
    );
  }
  updateTeacherAcademicEmail(teacherId: number, email: string) {
    return this.http.put(
      `${this.API_URL}/teacher/${teacherId}/academicEmail`,
      email,
      { withCredentials: true }
    );
  }
  getTeacherByAssignationId(assignationId: number) {
    return this.http.get<ResponseDTO<TeacherDTO>>(
      `${this.API_URL}/teacher/assignation/${assignationId}`,
      { withCredentials: true }
    );
  }
}
