import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AssignationCreateDTO } from '../models/AssignationCreateDTO';
import { ResponseDTO } from '../models/ResponseDTO';
import { AssignationDTO } from '../models/AssignationDTO';

@Injectable({
  providedIn: 'root',
})
export class AssignationService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  saveAssignation(assignation: AssignationCreateDTO) {
    return this.http.post<ResponseDTO<string>>(
      `${this.API_URL}/classAssignation`,
      assignation,
      { withCredentials: true }
    );
  }

  getAssignation(classId: number, subjectId: number) {
    return this.http.get<ResponseDTO<AssignationCreateDTO>>(
      `${this.API_URL}/classAssignation`,
      {
        params: { subjectId: subjectId, classId: classId },
        withCredentials: true,
      }
    );
  }

  getAssignationByTeacherId(id: number, year: number) {
    return this.http.get<ResponseDTO<AssignationDTO[]>>(
      `${this.API_URL}/classAssignation/teacher/${id}`,
      { params: { year: year }, withCredentials: true }
    );
  }

  getAssignationByStudentIdAndYear(studentId: number, year: number) {
    return this.http.get<ResponseDTO<AssignationDTO[]>>(
      `${this.API_URL}/classAssignation/student`,
      { params: { studentId: studentId, year: year }, withCredentials: true }
    );
  }
  getAssignationById(id: number) {
    return this.http.get<ResponseDTO<AssignationDTO>>(
      `${this.API_URL}/classAssignation/${id}`,
      { withCredentials: true }
    );
  }
}
