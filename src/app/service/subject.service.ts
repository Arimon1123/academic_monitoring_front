import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { SubjectDTO } from '../models/SubjectDTO';
import { ResponseDTO } from '../models/ResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  API_URL = environment.API_URL;
  constructor(private http: HttpClient) { }

  saveSubject(subject: SubjectDTO) {
    return this.http.post<ResponseDTO<string>>(`${this.API_URL}/subject`, subject, { withCredentials: true });
  }
}
