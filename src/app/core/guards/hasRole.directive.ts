import {
  Directive,
  effect,
  Inject,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthStateService } from '@app/shared/data-access/auth-state.service';

import { User, UserRole } from '../models/db.model';

@Directive({
  selector: '[hasRole]',
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  private user = toSignal(Inject(AuthStateService).currentUser$);

  roles = input.required<UserRole[]>({
    alias: 'hasRole',
  });

  constructor() {
    effect(() => {
      const user = this.user();
      const roles = this.roles();

      this.viewContainerRef.clear();

      if (user && roles.length > 0 && this.hasRole(user, roles)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }

  hasRole(user: User, roles: UserRole[]) {
    return roles.includes(user.role);
  }
}
