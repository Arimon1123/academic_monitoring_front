import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCreateDTO } from '../models/userCreateDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUser(user: UserCreateDTO) {
    return this.http.post('http://localhost:8080/user/save', user, { responseType: 'text' });
  }

  getUserList() {
    return this.http.get('http://localhost:8080/user', { responseType: 'json' });
  }
}
