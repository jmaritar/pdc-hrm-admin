import { Component, computed, Input, signal } from '@angular/core';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ColumnDef } from '@tanstack/angular-table';

import { DataTableToolbarComponent } from './components/data-table-toolbar/data-table-toolbar.component';

@Component({
  selector: 'app-data-table',
  imports: [DataTableToolbarComponent, HlmButtonDirective],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent<TData> {
  @Input() data: TData[] = [];
  @Input() columns: ColumnDef<TData, any>[] = [];

  showCounter = signal(false);
  count = signal(0);

  conditionalCount = computed(() => {
    if (this.showCounter()) {
      return `The count is ${this.count()}.`;
    } else {
      return 'Nothing to see here!';
    }
  });

  constructor() {
    console.log(`The current count is: ${this.count()}`);
  }
}
