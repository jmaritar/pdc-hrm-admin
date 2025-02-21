import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { toast } from 'ngx-sonner';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class BusinessTypeService {
  private _http = inject(HttpClient);

  // Obtener todos los tipos de empresa
  getCompanyTypes(): Observable<unknown> {
    return this._http.get(`${environment.API_URL}/companies/type/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener los tipos de empresa');
        return throwError(() => new Error(error));
      })
    );
  }

  // Crear un nuevo tipo de empresa
  createCompanyType(companyTypeData: any): Observable<any> {
    return this._http.post(`${environment.API_URL}/companies/type`, companyTypeData).pipe(
      catchError(error => {
        toast.error('Error al crear el tipo de empresa');
        return throwError(() => new Error(error));
      })
    );
  }

  // Actualizar un tipo de empresa existente
  updateCompanyType(companyTypeId: string, companyTypeData: any): Observable<any> {
    return this._http
      .put(`${environment.API_URL}/companies/type`, {
        company_type_id: companyTypeId,
        data: companyTypeData,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al actualizar el tipo de empresa');
          return throwError(() => new Error(error));
        })
      );
  }

  // Eliminar un tipo de empresa
  deleteCompanyType(companyTypeId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/companies/type/delete`, {
        company_type_id: companyTypeId,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al eliminar el tipo de empresa');
          return throwError(() => new Error(error));
        })
      );
  }
}
