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

  // Obtener todos los usuarios
  getUsers(): Observable<unknown> {
    return this._http.get(`${environment.API_URL}/users/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener los usuarios');
        return throwError(() => new Error(error));
      })
    );
  }

  // Crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    return this._http.post(`${environment.API_URL}/users`, userData).pipe(
      catchError(error => {
        toast.error('Error al crear el usuario');
        return throwError(() => new Error(error));
      })
    );
  }

  // Actualizar un usuario existente
  updateUser(userId: string, userData: any): Observable<any> {
    return this._http
      .put(`${environment.API_URL}/users`, {
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

  // Desactivar un usuario (soft delete)
  deactivateUser(userId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/users/deactivate`, {
        user_id: userId,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al desactivar el usuario');
          return throwError(() => new Error(error));
        })
      );
  }
}
