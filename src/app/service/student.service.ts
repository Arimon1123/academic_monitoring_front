import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { StudentCreateDTO } from '../models/StudentCreateDTO';
import { ResponseDTO } from '../models/ResponseDTO';
import { StudentDTO } from '../models/StudentDTO';
import { PageDTO } from '../models/PageDTO';

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
      { withCredentials: true }
    );
  }
  existsStudentByCi(ci: string) {
    return this.http.get<ResponseDTO<boolean>>(
      `${this.API_URL}/student/exists/ci/${ci}`,
      { withCredentials: true }
    );
  }
  existsStudentByRude(rude: string) {
    return this.http.get<ResponseDTO<boolean>>(
      `${this.API_URL}/student/exists/rude/${rude}`,
      { withCredentials: true }
    );
  }
  existsStudentByEmail(email: string) {
    return this.http.get<ResponseDTO<boolean>>(
      `${this.API_URL}/student/exists/email/${email}`,
      { withCredentials: true }
    );
  }
  getStudentByParentId(parentId: number) {
    return this.http.get<ResponseDTO<StudentDTO[]>>(
      `${this.API_URL}/student/parent/${parentId}`,
      { withCredentials: true }
    );
  }
  getStudentsByAssignationId(assignationId: number) {
    return this.http.get<ResponseDTO<StudentDTO[]>>(
      `${this.API_URL}/student/assignation/${assignationId}`,
      { withCredentials: true }
    );
  }
  getStudentById(studentId: number) {
    return this.http.get<ResponseDTO<StudentDTO>>(
      `${this.API_URL}/student/${studentId}`,
      { withCredentials: true }
    );
  }
  searchStudents(searchOptions: {
    name?: string;
    lastname?: string;
    ci?: string;
    rude?: string;
    page?: number;
    size?: number;
  }) {
    return this.http.get<ResponseDTO<PageDTO<StudentDTO[]>>>(
      `${this.API_URL}/student/search`,
      {
        params: {
          name: searchOptions.name ?? '',
          lastname: searchOptions.lastname ?? '',
          ci: searchOptions.ci ?? '',
          rude: searchOptions.rude ?? '',
          page: searchOptions.page ?? '',
          size: searchOptions.size ?? '',
        },
        withCredentials: true,
      }
    );
  }
  updateStudent(student: StudentDTO) {
    return this.http.put<ResponseDTO<string>>(
      `${this.API_URL}/student`,
      student,
      {
        withCredentials: true,
      }
    );
  }
  updateStudentClass(studentId: number, classId: number) {
    return this.http.put<ResponseDTO<string>>(
      `${this.API_URL}/student/${studentId}/class/${classId}`,
      null,
      {
        withCredentials: true,
      }
    );
  }
  updateStudentParents(studentId: number, parentIds: number[]) {
    return this.http.put<ResponseDTO<string>>(
      `${this.API_URL}/student/${studentId}/parent`,
      parentIds,
      {
        withCredentials: true,
      }
    );
  }
}
