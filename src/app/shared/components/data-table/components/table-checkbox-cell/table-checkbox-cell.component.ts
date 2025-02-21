import { Component, Input } from '@angular/core';

import { Row } from '@tanstack/angular-table';

@Component({
  selector: 'app-table-checkbox-cell',
  standalone: true,
  host: {
    class: 'flex w-10 items-center justify-center',
  },
  template: `
    <input
      type="checkbox"
      class="size-4"
      [checked]="getIsSelected()"
      (change)="onCheckboxChange($event)"
    />
  `,
})
export class TableCheckboxCellComponent<TData> {
  @Input() row!: Row<TData>;

  getIsSelected(): boolean {
    return this.row?.getIsSelected() ?? false;
  }

  onCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.row?.toggleSelected(isChecked);
  }
}
