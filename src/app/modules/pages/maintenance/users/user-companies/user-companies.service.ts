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
export class UserCompaniesService {
  private _http = inject(HttpClient);
  private _storage = inject(StorageService);
  private API_URL = `${environment.API_URL}/users`;

  // Obtener todas las empresas
  getCompanies(): Observable<any> {
    return this._http.get(`${environment.API_URL}/companies/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener las empresas');
        return throwError(() => new Error(error));
      })
    );
  }

  getCompaniesAvaibles(userId: string): Observable<any> {
    return this._http.post(`${this.API_URL}/find-available-companies`, { user_id: userId }).pipe(
      catchError(error => {
        toast.error('Error al obtener las empresas');
        return throwError(() => new Error(error));
      })
    );
  }

  // ✅ Asignar un usuario a una empresa
  assignUserToCompany(userId: string, companyId: string): Observable<any> {
    return this._http
      .post(`${this.API_URL}/assign-company`, { user_id: userId, company_id: companyId })
      .pipe(
        catchError(error => {
          toast.error('Error al asignar el usuario a la empresa');
          return throwError(() => new Error(error));
        })
      );
  }

  // ✅ Obtener todas las empresas de un usuario
  getUserCompanies(userId: string): Observable<any> {
    return this._http.post(`${this.API_URL}/find-user-companies`, { user_id: userId }).pipe(
      catchError(error => {
        toast.error('Error al obtener las empresas del usuario');
        return throwError(() => new Error(error));
      })
    );
  }

  // ✅ Obtener todos los usuarios de una empresa
  getCompanyUsers(companyId: string): Observable<any> {
    return this._http.post(`${this.API_URL}/find-company-users`, { company_id: companyId }).pipe(
      catchError(error => {
        toast.error('Error al obtener los usuarios de la empresa');
        return throwError(() => new Error(error));
      })
    );
  }

  // ✅ Actualizar una asignación usuario-empresa
  updateUserCompany(userId: string, companyId: string): Observable<any> {
    return this._http
      .put(`${this.API_URL}/update`, { user_id: userId, company_id: companyId })
      .pipe(
        catchError(error => {
          toast.error('Error al actualizar la asignación del usuario a la empresa');
          return throwError(() => new Error(error));
        })
      );
  }

  // ✅ Remover un usuario de una empresa
  removeUserFromCompany(userId: string, companyId: string): Observable<any> {
    return this._http
      .delete(`${this.API_URL}/remove-company-from-user`, {
        body: { user_id: userId, company_id: companyId },
      })
      .pipe(
        catchError(error => {
          toast.error('Error al remover el usuario de la empresa');
          return throwError(() => new Error(error));
        })
      );
  }
}
