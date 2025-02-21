import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { StorageService } from '@app/core/services/storage.service';
import { toast } from 'ngx-sonner';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http = inject(HttpClient);
  private _storage = inject(StorageService);
  private API_URL = `${environment.API_URL}/users`;

  // Obtener todos los usuarios
  getUsers(): Observable<unknown> {
    return this._http.get(`${this.API_URL}/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener los usuarios');
        return throwError(() => new Error(error));
      })
    );
  }

  // Obtener usuario por ID
  getUserById(userId: string): Observable<any> {
    return this._http.post(`${this.API_URL}/find-user`, { user_id: userId }).pipe(
      catchError(error => {
        toast.error('Error al obtener el usuario');
        return throwError(() => new Error(error));
      })
    );
  }

  // Crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    return this._http.post(`${this.API_URL}`, userData).pipe(
      catchError(error => {
        toast.error('Error al crear el usuario');
        return throwError(() => new Error(error));
      })
    );
  }

  // Actualizar un usuario existente
  updateUser(userId: string, userData: any): Observable<any> {
    return this._http
      .put(`${this.API_URL}`, {
        user_id: userId,
        data: userData,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al actualizar el usuario');
          return throwError(() => new Error(error));
        })
      );
  }

  // Activar o desactivar un usuario
  toggleUserStatus(userId: string): Observable<any> {
    return this._http
      .post(`${this.API_URL}/toggle-status`, {
        user_id: userId,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al actualizar el estado del usuario');
          return throwError(() => new Error(error));
        })
      );
  }

  // Eliminar un usuario
  deleteUser(userId: string): Observable<any> {
    return this._http.delete(`${this.API_URL}`, { body: { user_id: userId } }).pipe(
      catchError(error => {
        toast.error('Error al eliminar el usuario');
        return throwError(() => new Error(error));
      })
    );
  }
}
