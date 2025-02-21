import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { toast } from 'ngx-sonner';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuditLogsService {
  private _http = inject(HttpClient);
  private API_URL = `${environment.API_URL}/logs`;

  /**
   * 📌 Obtener todos los logs de auditoría.
   */
  getAllLogs(): Observable<any> {
    return this._http.get(`${this.API_URL}`).pipe(
      catchError(error => {
        toast.error('Error al obtener los logs de auditoría');
        return throwError(() => new Error(error));
      })
    );
  }
}
