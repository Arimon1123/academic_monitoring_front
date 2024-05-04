import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { ResponseDTO } from '../models/ResponseDTO';
import { UserDTO } from '../models/UserDTO';
import { UserDetailsDTO } from '../models/UserDetailsDTO';
import { UserDataDTO } from '../models/UserDataDTO';
import { UserCreateDTO } from '../models/UserCreateDTO';
import { PageDTO } from '../models/PageDTO';
import { RoleDTO } from '../models/RoleDTO';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  API_URL = environment.API_URL;

  createUser(formData: FormData) {
    return this.http.post<ResponseDTO<string>>(
      `${this.API_URL}/user`,
      formData,
      {
        responseType: 'json',
        withCredentials: true,
      }
    );
  }

  getUserList(
    search: {
      page: number;
      size: number;
      name: string;
      role: string;
      lastname: string;
      ci: string;
    } | null
  ) {
    return this.http.get<ResponseDTO<PageDTO<UserDataDTO[]>>>(
      `${this.API_URL}/user`,
      {
        params: {
          page: search!.page,
          size: search!.size,
          name: search!.name,
          role: search!.role,
          lastname: search!.lastname,
          ci: search!.ci,
        },
        responseType: 'json',
        withCredentials: true,
      }
    );
  }

  blockUser(username: string) {
    return this.http.put(`${this.API_URL}/user/block/${username}`, null, {
      responseType: 'json',
      withCredentials: true,
    });
  }

  unblockUser(username: string) {
    return this.http.put(`${this.API_URL}/user/unblock/${username}`, null, {
      responseType: 'json',
      withCredentials: true,
    });
  }

  userDetails() {
    return this.http.get<ResponseDTO<UserDTO>>(`${this.API_URL}/auth/details`, {
      responseType: 'json',
      withCredentials: true,
    });
  }
  getUser(id: number) {
    return this.http.get<ResponseDTO<UserDataDTO>>(
      `${this.API_URL}/user/${id}`,
      { responseType: 'json', withCredentials: true }
    );
  }
  getUserRoleDetails(role: string) {
    return this.http.get<ResponseDTO<UserDetailsDTO>>(
      `${this.API_URL}/auth/role`,
      { responseType: 'json', withCredentials: true, params: { role: role } }
    );
  }
  getUserDetails(role: string, username: string) {
    return this.http.get<ResponseDTO<UserDetailsDTO>>(
      `${this.API_URL}/user/details`,
      {
        responseType: 'json',
        withCredentials: true,
        params: { role: role, username: username },
      }
    );
  }
  updateUserRoles(user: UserDTO) {
    return this.http.put<ResponseDTO<string>>(
      `${this.API_URL}/user/roles`,
      user,
      {
        responseType: 'json',
        withCredentials: true,
      }
    );
  }
  updateUser(user: UserCreateDTO) {
    return this.http.put<ResponseDTO<string>>(`${this.API_URL}/user`, user, {
      responseType: 'json',
      withCredentials: true,
    });
  }
}
