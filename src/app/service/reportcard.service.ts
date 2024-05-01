import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ReportCardService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  generateReportCards(ids: number[], bimester: number, isFinalReport: boolean) {
    return this.http.get(`${this.API_URL}/reportCard`, {
      params: {
        classId: ids,
        bimester: bimester,
        isFinalReport: isFinalReport,
      },
      withCredentials: true,
      responseType: 'arraybuffer',
    });
  }
}
