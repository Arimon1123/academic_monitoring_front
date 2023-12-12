import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCreateDTO } from '../models/userCreateDTO';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  createUser(user: UserCreateDTO) {
    return this.http.post(`${environment.API_URL}/user/save`, user, { responseType: 'text' });
  }

  getUserList() {
    return this.http.get(`${environment.API_URL}/user`, { responseType: 'json' });
  }
}
