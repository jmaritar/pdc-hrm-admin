import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { toast } from 'ngx-sonner';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class BusinessesService {
  private _http = inject(HttpClient);

  // Obtener todas las empresas
  getCompanies(): Observable<unknown> {
    return this._http.get(`${environment.API_URL}/companies/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener las empresas');
        return throwError(() => new Error(error));
      })
    );
  }

  // Crear una nueva empresa
  createCompany(companyData: any): Observable<any> {
    return this._http.post(`${environment.API_URL}/companies`, companyData).pipe(
      catchError(error => {
        toast.error('Error al crear la empresa');
        return throwError(() => new Error(error));
      })
    );
  }

  // Actualizar una empresa existente
  updateCompany(companyId: string, companyData: any): Observable<any> {
    return this._http
      .put(`${environment.API_URL}/companies`, {
        company_id: companyId,
        data: companyData,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al actualizar la empresa');
          return throwError(() => new Error(error));
        })
      );
  }

  // Desactivar una empresa (soft delete)
  deactivateCompany(companyId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/companies/deactivate`, {
        company_id: companyId,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al desactivar la empresa');
          return throwError(() => new Error(error));
        })
      );
  }

  // Eliminar una empresa
  deleteCompany(companyId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/companies/delete`, {
        company_id: companyId,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al eliminar la empresa');
          return throwError(() => new Error(error));
        })
      );
  }

  getCompanyTypes(): Observable<any> {
    return this._http.get(`${environment.API_URL}/companies/type/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener los tipos de empresas');
        return throwError(() => new Error(error));
      })
    );
  }

  getCountries(): Observable<any> {
    return this._http.get(`${environment.API_URL}/countries/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener los países');
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

  getMunicipalityByIdDepartment(departmentId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/municipalities/find-by-department`, {
        department_id: departmentId,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al obtener el municipio');
          return throwError(() => new Error(error));
        })
      );
  }
}
