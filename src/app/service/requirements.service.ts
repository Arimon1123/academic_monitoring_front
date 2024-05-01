import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { ResponseDTO } from '../models/ResponseDTO';
import { RequirementDTO } from '../models/RequirementDTO';

@Injectable({
  providedIn: 'root',
})
export class RequirementsService {
  API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getAllRequirements() {
    return this.http.get<ResponseDTO<RequirementDTO[]>>(
      `${this.API_URL}/requirement`,
      { withCredentials: true },
    );
  }
}
