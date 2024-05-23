import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationDTO } from '../models/ConfigurationDTO';
import { HttpClient } from '@angular/common/http';
import { ResponseDTO } from '../models/ResponseDTO';
import { environment } from '../environments/environment.development';
import { UnfinishedSubjectDTO } from '../models/UnfinishedSubjectDTO';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}
  getConfigurations() {
    return this.http.get<ResponseDTO<ConfigurationDTO>>(
      `${this.API_URL}/configuration`,
      {
        withCredentials: true,
      }
    );
  }
  finishBimester() {
    return this.http.post<ResponseDTO<UnfinishedSubjectDTO[]>>(
      `${this.API_URL}/configuration/finishBimester`,
      null,
      { withCredentials: true }
    );
  }
  finishYear() {
    return this.http.post<ResponseDTO<string>>(
      `${this.API_URL}/configuration/finishYear`,
      null,
      { withCredentials: true }
    );
  }
}
