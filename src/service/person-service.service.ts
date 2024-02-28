import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  API_URL = environment.API_URL + '/person';
  constructor(private http: HttpClient) { }
  existsByPhone(phone: string) {
    return this.http.get(`${this.API_URL}/exists/phone/${phone}`, { responseType: 'json', withCredentials: true });
  }
  existsByEmail(email: string) {
    return this.http.get(`${this.API_URL}/exists/email/${email}`, { responseType: 'json', withCredentials: true });
  }
  existsByUsername(username: string) {
    return this.http.get(`${this.API_URL}/exists/username/${username}`, { responseType: 'json', withCredentials: true });
  }
  existsByCi(ci: string) {
    return this.http.get(`${this.API_URL}/exists/ci/${ci}`, { responseType: 'json', withCredentials: true });
  }
}
