import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { StudentCreateDTO } from '../models/StudentCreateDTO';
import { ResponseDTO } from '../models/ResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  API_URL = environment.API_URL;
  constructor(private http: HttpClient) { }

  saveStudent(student: StudentCreateDTO) {
    return this.http.post<ResponseDTO<string>>(`${this.API_URL}/student`, student, { withCredentials: true });
  }
  existsStudentByCi(ci: string) {
    return this.http.get<ResponseDTO<boolean>>(`${this.API_URL}/student/exists/ci/${ci}`, { withCredentials: true });
  }
  existsStudentByRude(rude: string) {
    return this.http.get<ResponseDTO<boolean>>(`${this.API_URL}/student/exists/rude/${rude}`, { withCredentials: true });
  }
}
