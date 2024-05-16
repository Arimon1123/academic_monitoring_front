import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { ResponseDTO } from '../models/ResponseDTO';
import { ParentDTO } from '../models/ParentDTO';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getParentByCi(ci: string) {
    return this.http.get<ResponseDTO<ParentDTO[]>>(`${this.API_URL}/parent`, {
      params: { ci: ci },
      withCredentials: true,
    });
  }
  getParentsByStudentId(studentId: number) {
    return this.http.get<ResponseDTO<ParentDTO[]>>(
      `${this.API_URL}/parent/student/${studentId}`,
      {
        withCredentials: true,
      }
    );
  }
}
