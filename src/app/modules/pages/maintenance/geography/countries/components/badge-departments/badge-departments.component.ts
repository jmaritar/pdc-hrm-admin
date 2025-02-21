import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEarth } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { Row } from '@tanstack/angular-table';

interface Country {
  id_country: number;
  name: string;
  count_departments: number;
}

@Component({
  selector: 'app-badge-departments',
  standalone: true,
  imports: [HlmIconDirective, NgIcon],
  providers: [
    provideIcons({
      lucideEarth,
    }),
  ],
  template: `
    <div class="relative inline-block">
      <!-- Círculo rojo con el número de departamentos -->
      <span
        class="absolute z-0 -top-2 -right-2 flex items-center justify-center size-5 bg-red-500 text-white text-xs font-bold rounded-full shadow-md"
      >
        {{ row.original?.count_departments }}
      </span>

      <!-- Botón azul con ícono Earth 🌍 -->
      <button
        class="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
        (click)="navigateToDepartments()"
      >
        <ng-icon hlm size="sm" name="lucideEarth" />
      </button>
    </div>
  `,
})
export class BadgeDepartmentsComponent {
  @Input() row!: Row<Country>;
  private router = inject(Router); // Inyectamos el Router de Angular

  navigateToDepartments() {
    if (!this.row || !this.row.original) return;

    const countryData: Country = this.row.original;

    // Redirigimos con el Router de Angular (SIN recargar la página)
    this.router.navigate(['/maintenance/geography/countries/departments', countryData.id_country]);
  }
}
