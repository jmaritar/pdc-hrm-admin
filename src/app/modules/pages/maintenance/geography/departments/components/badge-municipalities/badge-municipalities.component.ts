import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEarth } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { Row } from '@tanstack/angular-table';

interface Country {
  id_department: number;
  name: string;
  count_municipalities: number;
}

@Component({
  selector: 'app-badge-municipalities',
  standalone: true,
  imports: [CommonModule, HlmIconDirective, NgIcon],
  providers: [
    provideIcons({
      lucideEarth,
    }),
  ],
  template: `
    <div class="relative inline-block">
      <!-- Círculo rojo con el número de departamentos -->
      <span
        *ngIf="row.original.count_municipalities > 0"
        class="absolute z-0 -top-2 -right-2 flex items-center justify-center size-5
               bg-red-500 text-white text-xs font-bold rounded-full shadow-md"
      >
        {{ row.original.count_municipalities }}
      </span>

      <!-- Botón azul con ícono Earth 🌍 -->
      <button
        class="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg
               shadow-lg hover:bg-blue-700 transition"
        (click)="navigateToDepartments()"
      >
        <ng-icon hlm size="sm" name="lucideEarth" />
      </button>
    </div>
  `,
})
export class BadgeMunicipalitiesComponent {
  @Input() row!: Row<Country>;
  private router = inject(Router); // Inyectamos el Router de Angular

  navigateToDepartments() {
    if (!this.row || !this.row.original) return;

    const deptoData: Country = this.row.original;

    this.router.navigate(
      ['/maintenance/geography/countries/departments/municipalities', deptoData.id_department],
      {
        queryParams: { name: deptoData.name },
      }
    );
  }
}
