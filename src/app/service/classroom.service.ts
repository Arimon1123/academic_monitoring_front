import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ClassroomDTO } from '../models/ClassroomDTO';
import { ResponseDTO } from '../models/ResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getClassroomsByRequirements(requirementIds: number[]) {
    return this.http.get<ResponseDTO<ClassroomDTO[]>>(
      `${this.API_URL}/classroom`,
      { params: { requirements: requirementIds }, withCredentials: true },
    );
  }
}
