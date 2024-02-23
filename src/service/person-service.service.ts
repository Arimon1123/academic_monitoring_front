import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }
  existsByPhone(phone: string) {
    return this.http.get(`http://localhost:8080/person/exists/phone/${phone}`, { responseType: 'json', withCredentials: true });
  }
  existsByEmail(email: string) {
    return this.http.get(`http://localhost:8080/person/exists/email/${email}`, { responseType: 'json', withCredentials: true });
  }
  existsByUsername(username: string) {
    return this.http.get(`http://localhost:8080/person/exists/username/${username}`, { responseType: 'json', withCredentials: true });
  }
  existsByCi(ci: string) {
    return this.http.get(`http://localhost:8080/person/exists/ci/${ci}`, { responseType: 'json', withCredentials: true });
  }
}
