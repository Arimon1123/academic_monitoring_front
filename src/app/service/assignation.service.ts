import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AssignationCreateDTO } from '../models/AssignationCreateDTO';
import { ResponseDTO } from '../models/ResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class AssignationService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) { }

  saveAssignation(assignation: AssignationCreateDTO) {
    return this.http.post<ResponseDTO<string>>(`${this.API_URL}/classAssignation`, assignation, { withCredentials: true });
  }
}
