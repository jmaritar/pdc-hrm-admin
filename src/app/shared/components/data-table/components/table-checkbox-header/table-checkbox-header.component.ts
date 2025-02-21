import { Component, Input } from '@angular/core';

import { Table } from '@tanstack/angular-table';

@Component({
  selector: 'app-table-checkbox-header',
  standalone: true,
  host: {
    class: 'flex w-10 items-center justify-center',
  },
  template: `
    <input
      type="checkbox"
      class="size-4"
      [checked]="getIsAllRowsSelected()"
      [indeterminate]="getIsSomeRowsSelected()"
      (change)="onCheckboxChange($event)"
    />
  `,
})
export class TableCheckboxHeaderComponent<TData> {
  @Input() table!: Table<TData>;

  getIsAllRowsSelected(): boolean {
    return this.table?.getIsAllPageRowsSelected() ?? false;
  }

  getIsSomeRowsSelected(): boolean {
    return this.table?.getIsSomePageRowsSelected() ?? false;
  }

  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.table?.toggleAllPageRowsSelected(isChecked);
  }
}
