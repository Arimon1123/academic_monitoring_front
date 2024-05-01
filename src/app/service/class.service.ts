import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { ResponseDTO } from '../models/ResponseDTO';
import { ClassListDTO } from '../models/ClassListDTO';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getClassListByGradeIdAndYearAndShift(
    gradeId: number,
    year: number,
    shift: number,
  ) {
    return this.http.get<ResponseDTO<ClassListDTO[]>>(`${this.API_URL}/class`, {
      params: { gradeId: gradeId, year: year, shift: shift },
      withCredentials: true,
    });
  }
}
