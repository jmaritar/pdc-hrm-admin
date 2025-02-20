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
export class CountryService {
  private _http = inject(HttpClient);
  private _storage = inject(StorageService);

  getCountries(): Observable<unknown> {
    return this._http.get(`${environment.API_URL}/countries/all`).pipe(
      catchError(error => {
        toast.error('Error al obtener los países');
        return throwError(() => new Error(error));
      })
    );
  }

  getCountryById(countryId: string): Observable<any> {
    return this._http.post(`${environment.API_URL}/countries/find`, { country_id: countryId }).pipe(
      catchError(error => {
        toast.error('Error al obtener el país');
        return throwError(() => new Error(error));
      })
    );
  }

  createCountry(countryData: any): Observable<any> {
    return this._http.post(`${environment.API_URL}/countries`, countryData).pipe(
      catchError(error => {
        toast.error('Error al crear el país');
        return throwError(() => new Error(error));
      })
    );
  }

  updateCountry(countryId: string, countryData: any): Observable<any> {
    return this._http
      .put(`${environment.API_URL}/countries`, {
        country_id: countryId,
        data: countryData,
      })
      .pipe(
        catchError(error => {
          toast.error('Error al actualizar el país');
          return throwError(() => new Error(error));
        })
      );
  }

  deactivateCountry(countryId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/countries/deactivate`, { country_id: countryId })
      .pipe(
        catchError(error => {
          toast.error('Error al desactivar el país');
          return throwError(() => new Error(error));
        })
      );
  }

  deleteCountry(countryId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/countries/delete`, { country_id: countryId })
      .pipe(
        catchError(error => {
          toast.error('Error al eliminar el país');
          return throwError(() => new Error(error));
        })
      );
  }
}
