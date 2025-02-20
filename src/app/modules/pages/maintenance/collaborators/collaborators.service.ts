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
export class CollaboratorsService {
  private _http = inject(HttpClient);
  private _storage = inject(StorageService);

  // Obtener todos los colaboradores
  getCollaborators(): Observable<unknown> {
    return this._http.get(`${environment.API_URL}/collaborators/list`).pipe(
      catchError(error => {
        toast.error('Error al obtener los colaboradores');
        return throwError(() => new Error(error));
      })
    );
  }

  // Crear un nuevo colaborador
  createCollaborator(collaboratorData: any): Observable<any> {
    return this._http.post(`${environment.API_URL}/collaborators`, collaboratorData).pipe(
      catchError(error => {
        toast.error('Error al crear el colaborador');
        return throwError(() => new Error(error));
      })
    );
  }

  // Asignar un colaborador a una empresa
  assignCompanyToCollaborator(assignCompanyData: any): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/collaborators/assign-company`, assignCompanyData)
      .pipe(
        catchError(error => {
          toast.error('Error al asignar el colaborador a la empresa');
          return throwError(() => new Error(error));
        })
      );
  }

  // Desactivar un colaborador (soft delete)
  deactivateCollaborator(collaboratorId: string): Observable<any> {
    return this._http
      .post(`${environment.API_URL}/collaborators/deactivate`, { collaborator_id: collaboratorId })
      .pipe(
        catchError(error => {
          toast.error('Error al desactivar el colaborador');
          return throwError(() => new Error(error));
        })
      );
  }
}
