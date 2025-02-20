import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideChevronsUpDown,
  lucideEyeOff,
} from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import {
  HlmMenuComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuSeparatorComponent,
} from '@spartan-ng/ui-menu-helm';
import { Column } from '@tanstack/angular-table';

const columnNames: Record<string, string> = {
  firstName: 'Nombre',
  lastName: 'Apellido',
  age: 'Edad',
  visits: 'Visitas',
  status: 'Estado',
  progress: 'Progreso',
};

@Component({
  selector: 'app-data-table-column-header',
  imports: [
    CommonModule,

    BrnMenuTriggerDirective,

    HlmIconDirective,
    NgIcon,

    HlmButtonDirective,

    HlmMenuComponent,
    HlmMenuItemDirective,
    HlmMenuItemIconDirective,
    HlmMenuSeparatorComponent,
  ],
  providers: [provideIcons({ lucideArrowDown, lucideArrowUp, lucideChevronsUpDown, lucideEyeOff })],
  templateUrl: './data-table-column-header.component.html',
})
export class DataTableColumnHeaderComponent<TData, TValue> {
  @Input() column!: Column<TData, TValue>;
  // @Input() title!: string;

  get columnTitle(): string {
    return columnNames[this.column.id] || this.column.id;
  }
}
