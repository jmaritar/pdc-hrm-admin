import { Component, Input } from '@angular/core';

import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { Table } from '@tanstack/angular-table';

// import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-data-table-toolbar',
  standalone: true,
  imports: [HlmInputDirective],
  templateUrl: './data-table-toolbar.component.html',
})
export class DataTableToolbarComponent<TData> {
  @Input() table!: Table<TData>;

  constructor() {
    console.log('Toolbar created', this.table);
  }

  updateFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const column = this.table.getColumn('firstName');

    if (column && column.setFilterValue) {
      column.setFilterValue(value);
    }
  }
}
