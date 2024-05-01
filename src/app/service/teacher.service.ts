import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { TeacherDTO } from '../models/TeacherDTO';
import { ResponseDTO } from '../models/ResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getTeachersBySubject(id: number) {
    return this.http.get<ResponseDTO<TeacherDTO[]>>(
      this.API_URL + '/teacher/subject/' + id,
      { withCredentials: true },
    );
  }
  getTeacherById(id: number) {
    return this.http.get<ResponseDTO<TeacherDTO>>(
      this.API_URL + '/teacher/' + id,
      { withCredentials: true },
    );
  }
}
