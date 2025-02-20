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
export class MunicipalityService {
  private _http = inject(HttpClient);
  private _storage = inject(StorageService);

  getMunicipalities(): Observable<unknown> {
    return this._http.get(`${environment.API_URL}/municipalities/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener los municipios');
        return throwError(() => new Error(error));
      })
    );
  }

  getDepartments(): Observable<unknown> {
    return this._http.get(`${environment.API_URL}/departments/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener los departamentos');
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

  createMunicipality(municipalityData: any): Observable<any> {
    return this._http.post(`${environment.API_URL}/municipalities`, municipalityData).pipe(
      catchError(error => {
        toast.error('Error al crear el municipio');
        return throwError(() => new Error(error));
      })
    );
  }

  updateMunicipality(municipalityId: string, municipalityData: any): Observable<any> {
    return this._http
      .put(`${environment.API_URL}/municipalities`, {
        municipality_id: municipalityId,
        data: municipalityData,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al actualizar el municipio');
          return throwError(() => new Error(error));
        })
      );
  }

  deactivateMunicipality(municipalityId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/municipalities/deactivate`, { municipality_id: municipalityId })
      .pipe(
        catchError(error => {
          toast.error('Error al desactivar el municipio');
          return throwError(() => new Error(error));
        })
      );
  }

  deleteMunicipality(municipalityId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/municipalities/delete`, { municipality_id: municipalityId })
      .pipe(
        catchError(error => {
          toast.error('Error al eliminar el municipio');
          return throwError(() => new Error(error));
        })
      );
  }

  getCountries(): Observable<unknown> {
    return this._http.get(`${environment.API_URL}/countries/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener los países');
        return throwError(() => new Error(error));
      })
    );
  }

  getDepartmentsByCountry(countryId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/departments/by_country`, { country_id: countryId })
      .pipe(
        catchError(error => {
          toast.error('Error al obtener los departamentos');
          return throwError(() => new Error(error));
        })
      );
  }
}
