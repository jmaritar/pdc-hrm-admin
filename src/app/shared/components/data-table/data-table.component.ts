import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import {
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, HlmTableComponent, HlmTrowComponent, HlmThComponent, HlmTdComponent],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  @Input() columns: { key: string; label: string; width?: string }[] = [];
  @Input() data: Record<string, unknown>[] = [];
  @Input() actions: { label: string; callback: (row: any) => void }[] = [];

  handleAction(action: { label: string; callback: (row: any) => void }, row: any) {
    action.callback(row);
  }
}
