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
export class DepartmentService {
  private _http = inject(HttpClient);
  private _storage = inject(StorageService);

  getDepartments(): Observable<unknown> {
    return this._http.get(`${environment.API_URL}/departments/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener los departamentos');
        return throwError(() => new Error(error));
      })
    );
  }

  getDepartmentByIdCountry(countryId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/departments/find-by-country`, { country_id: countryId })
      .pipe(
        catchError(error => {
          toast.error('Error al obtener el departamento');
          return throwError(() => new Error(error));
        })
      );
  }

  createDepartment(departmentData: any): Observable<any> {
    return this._http.post(`${environment.API_URL}/departments`, departmentData).pipe(
      catchError(error => {
        toast.error('Error al crear el departamento');
        return throwError(() => new Error(error));
      })
    );
  }

  updateDepartment(departmentId: string, departmentData: any): Observable<any> {
    return this._http
      .put(`${environment.API_URL}/departments`, {
        department_id: departmentId,
        data: departmentData,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al actualizar el departamento');
          return throwError(() => new Error(error));
        })
      );
  }

  deactivateDepartment(departmentId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/departments/deactivate`, { department_id: departmentId })
      .pipe(
        catchError(error => {
          toast.error('Error al desactivar el departamento');
          return throwError(() => new Error(error));
        })
      );
  }

  deleteDepartment(departmentId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/departments/delete`, { department_id: departmentId })
      .pipe(
        catchError(error => {
          toast.error('Error al eliminar el departamento');
          return throwError(() => new Error(error));
        })
      );
  }
}
