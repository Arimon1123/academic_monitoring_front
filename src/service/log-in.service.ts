import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',

})
export class LogInService {
  API_URL = 'http://localhost:8080';
  constructor(private http: HttpClient) { }
  login(user: any) {
    return this.http.post(`${this.API_URL}/authenticate`, user, { responseType: 'text', withCredentials: true });

  }
}
