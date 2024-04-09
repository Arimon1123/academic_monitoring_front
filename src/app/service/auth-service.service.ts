import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { LocalStorageService } from './local-storage.service';
import {ResponseDTO} from "../models/ResponseDTO";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = environment.API_URL + "/auth";

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) { }

  login(user: any) {
    return this.http.post<ResponseDTO<boolean>>(`${this.API_URL}/authenticate`, user, { withCredentials: true })
  }

  logout() {
    return this.http.get(`${this.API_URL}/logout`, { responseType: 'text', withCredentials: true });
  }
  isLoggedIn() {
    const isLogged = this.localStorageService.getItem('isLogged');
    return !!isLogged;

  }
}


