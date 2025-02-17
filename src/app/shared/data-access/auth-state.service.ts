import { inject, Injectable } from '@angular/core';

import { User } from '@app/core/models/db.model';
import { StorageService } from '@app/core/services/storage.service';
import { BehaviorSubject } from 'rxjs';

interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private _currentUser = new BehaviorSubject<User | null>(this.decodeToken());
  private _storageService = inject(StorageService);

  currentUser$ = this._currentUser.asObservable();

  signOut() {
    this._storageService.remove('session');
    this._currentUser.next(null);
  }

  getSession(): Session | null {
    let currentSession: Session | null = null;

    const maybeSession = this._storageService.get<Session>('session');

    console.log({ maybeSession });

    if (maybeSession !== null) {
      if (this._isValidSession(maybeSession)) {
        currentSession = maybeSession;
      } else {
        this.signOut();
      }
    }

    return currentSession;
  }

  private _isValidSession(maybeSession: unknown): boolean {
    return (
      typeof maybeSession === 'object' && maybeSession !== null && 'access_token' in maybeSession
    );
  }

  private decodeToken() {
    const sessionData = localStorage.getItem('session');

    return sessionData ? JSON.parse(sessionData) : null;
  }
}
