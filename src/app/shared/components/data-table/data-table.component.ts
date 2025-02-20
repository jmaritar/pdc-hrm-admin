import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';

// import {
//   HlmCaptionComponent,
//   HlmTableComponent,
//   HlmTdComponent,
//   HlmThComponent,
//   HlmTrowComponent,
// } from '@spartan-ng/ui-table-helm';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/angular-table';

import { DataTableToolbarComponent } from './components/data-table-toolbar/data-table-toolbar.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [DataTableToolbarComponent, FlexRenderDirective],
  templateUrl: './data-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<TData> {
  @Input() data: TData[] = [];
  @Input() columns: ColumnDef<TData, any>[] = [];

  sorting = signal<SortingState>([]);

  firstColumnAccessorKey = this.columns.length ? this.columns[0].id : '';

  table = createAngularTable(() => ({
    data: this.data.length ? this.data : [],
    columns: this.columns.length ? this.columns : [],
    state: {
      sorting: this.sorting(),
    },
    onSortingChange: updater =>
      this.sorting.set(updater instanceof Function ? updater(this.sorting()) : updater),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  }));
}
