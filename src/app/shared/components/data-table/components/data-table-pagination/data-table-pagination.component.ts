import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsLeft,
  lucideChevronsRight,
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Table } from '@tanstack/angular-table';

@Component({
  selector: 'app-data-table-pagination',
  standalone: true,
  imports: [HlmButtonDirective, CommonModule, NgIcon],
  providers: [
    provideIcons({
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsLeft,
      lucideChevronsRight,
    }),
  ],
  templateUrl: './data-table-pagination.component.html',
})
export class DataTablePaginationComponent<TData> {
  @Input() table!: Table<TData>;

  // ✅ Método para manejar el cambio de selección
  updatePageSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = Number(target.value);
    if (!isNaN(value)) {
      this.table.setPageSize(value);
    }
  }
}
