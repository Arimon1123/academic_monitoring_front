import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { StudentCreateDTO } from '../models/StudentCreateDTO';
import { ResponseDTO } from '../models/ResponseDTO';
import { StudentDTO } from '../models/StudentDTO';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  saveStudent(student: StudentCreateDTO) {
    return this.http.post<ResponseDTO<string>>(
      `${this.API_URL}/student`,
      student,
      { withCredentials: true },
    );
  }
  existsStudentByCi(ci: string) {
    return this.http.get<ResponseDTO<boolean>>(
      `${this.API_URL}/student/exists/ci/${ci}`,
      { withCredentials: true },
    );
  }
  existsStudentByRude(rude: string) {
    return this.http.get<ResponseDTO<boolean>>(
      `${this.API_URL}/student/exists/rude/${rude}`,
      { withCredentials: true },
    );
  }
  getStudentByParentId(parentId: number) {
    return this.http.get<ResponseDTO<StudentDTO[]>>(
      `${this.API_URL}/student/parent/${parentId}`,
      { withCredentials: true },
    );
  }
  getStudentsByAssignationId(assignationId: number) {
    return this.http.get<ResponseDTO<StudentDTO[]>>(
      `${this.API_URL}/student/assignation/${assignationId}`,
      { withCredentials: true },
    );
  }
  getStudentById(studentId: number) {
    return this.http.get<ResponseDTO<StudentDTO>>(
      `${this.API_URL}/student/${studentId}`,
      { withCredentials: true },
    );
  }
}
