import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUsers } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { Row } from '@tanstack/angular-table';

interface UserCompany {
  id_user: string;
  name: string;
  count_companies: number;
}

@Component({
  selector: 'app-badge-users-companies',
  standalone: true,
  imports: [CommonModule, HlmIconDirective, NgIcon],
  providers: [
    provideIcons({
      lucideUsers,
    }),
  ],
  template: `
    <div class="relative inline-block">
      <!-- Círculo rojo con el número de compañías -->
      <span
        *ngIf="row.original.count_companies > 0"
        class="absolute z-0 -top-2 -right-2 flex items-center justify-center size-5
               bg-red-500 text-white text-xs font-bold rounded-full shadow-md"
      >
        {{ row.original.count_companies }}
      </span>

      <!-- Botón azul con ícono de usuarios 👥 -->
      <button
        class="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg
               shadow-lg hover:bg-blue-700 transition"
        (click)="navigateToUserCompanies()"
      >
        <ng-icon hlm size="sm" name="lucideUsers" />
      </button>
    </div>
  `,
})
export class BadgeUsersCompaniesComponent {
  @Input() row!: Row<UserCompany>;
  private router = inject(Router);

  navigateToUserCompanies() {
    if (!this.row || !this.row.original) return;

    const userData: UserCompany = this.row.original;

    this.router.navigate(['maintenance/users/companies', userData.id_user], {
      queryParams: { name: userData.name },
    });
  }
}
