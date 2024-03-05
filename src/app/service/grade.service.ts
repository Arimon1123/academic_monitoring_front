import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { GradeDTO } from '../models/GradeDTO';
import { ResponseDTO } from '../models/ResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  API_URL = environment.API_URL;
  constructor(private http: HttpClient) { }

  getAllGrades() {
    return this.http.get<ResponseDTO<GradeDTO[]>>(`${this.API_URL}/grade`, { withCredentials: true });
  }
}
