import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { StorageService } from '@app/core/services/storage.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http = inject(HttpClient);
  private _storage = inject(StorageService);

  signUp(email: string, password: string): Observable<unknown> {
    return this._http
      .post(`${environment.API_URL}/auth/sign-up`, {
        email,
        password,
      })
      .pipe(
        tap(response => {
          this._storage.set('session', JSON.stringify(response));
        })
      );
  }

  signIn(email: string, password: string): Observable<unknown> {
    return this._http
      .post(`${environment.API_URL}/auth/login-admin`, {
        email,
        password,
      })
      .pipe(
        tap(response => {
          this._storage.set('session', JSON.stringify(response));
        })
      );
  }
}
