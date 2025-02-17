import { Component, Input } from '@angular/core';

import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import {
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    HlmTableComponent,
    HlmTrowComponent,
    HlmThComponent,
    HlmTdComponent,
    BrnSelectImports,
    HlmSelectImports,
  ],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  @Input() columns: {
    key: string;
    label: string;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    class?: string;
  }[] = [];
  @Input() data: Record<string, unknown>[] = [];
}
