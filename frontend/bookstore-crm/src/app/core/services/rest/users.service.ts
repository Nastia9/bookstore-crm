import { Injectable, inject } from '@angular/core';
import { User } from '../../models/user';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AddEditUserRequestParameter } from '../../models/request/add-edit-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
      return this.http.get<User[]>(`${environment.apiUrl}/users/`);
  }

  createUser(dto: AddEditUserRequestParameter): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, dto);
  }

  updateUser(id: string, dto: AddEditUserRequestParameter): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${id}`, dto);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`);
  }
}
