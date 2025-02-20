import { Component, computed, inject, signal, TrackByFunction } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideChevronDown,
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsUp,
  lucideChevronUp,
  lucideCircle,
  lucideCircleCheckBig,
  lucideCircleDashed,
  lucideCircleDot,
  lucideCircleHelp,
  lucideCircleOff,
  lucideCog,
  lucideDot,
  lucideEllipsis,
  lucideLayers,
  lucideLogOut,
  lucideUser,
} from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { BrnTableModule, PaginatorState } from '@spartan-ng/brain/table';
import { HlmAvatarImports } from '@spartan-ng/ui-avatar-helm';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';
import { HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmMenuModule } from '@spartan-ng/ui-menu-helm';
import { HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { HlmTableModule } from '@spartan-ng/ui-table-helm';

import { TableActionsComponent } from './components/table-actions.component';
import { PriorityIconPipe } from './pipes/priority-icon.pipe';
import { StatusIconPipe } from './pipes/status-icon.pipe';
import { SortingColumns, Task, TasksService } from './services/tasks.service';

@Component({
  selector: 'app-data-table-use',
  standalone: true,
  imports: [
    FormsModule,

    BrnMenuTriggerDirective,
    HlmMenuModule,

    BrnTableModule,
    HlmTableModule,

    HlmButtonModule,

    HlmIconDirective,

    HlmCheckboxComponent,

    BrnSelectModule,
    HlmSelectModule,
    TableActionsComponent,
    NgIcon,
    StatusIconPipe,
    PriorityIconPipe,
    HlmAvatarImports,
  ],
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideChevronDown,
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronUp,
      lucideChevronsUp,
      lucideCircle,
      lucideCircleCheckBig,
      lucideCircleDashed,
      lucideCircleDot,
      lucideCircleHelp,
      lucideCircleOff,
      lucideCog,
      lucideDot,
      lucideEllipsis,
      lucideLayers,
      lucideLogOut,
      lucideUser,
    }),
  ],
  host: {
    class: 'w-full',
  },
  template: `
    <div class="h-full flex-1 flex-col space-y-4 p-4">
      <div class="flex items-center justify-between space-y-2">
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold tracking-tight">Data Table</h2>
          <p class="text-muted-foreground">Component to display data in a table format</p>
        </div>
      </div>

      <app-table-actions />

      <div class="wip-table">
        <brn-table
          hlm
          stickyHeader
          class="border-border block max-h-[50svh] overflow-auto rounded-md border"
          [dataSource]="tableSource()"
          [displayedColumns]="allDisplayedColumns()"
          [trackBy]="trackBy"
        >
          <brn-column-def name="select" class="w-12">
            <hlm-th *brnHeaderDef>
              <hlm-checkbox [checked]="checkboxState()" (changed)="handleHeaderCheckboxChange()" />
            </hlm-th>
            <hlm-td *brnCellDef="let element">
              <hlm-checkbox
                [checked]="isPaymentSelected(element)"
                (changed)="togglePayment(element)"
              />
            </hlm-td>
          </brn-column-def>
          <brn-column-def name="id" class="w-32">
            <hlm-th truncate *brnHeaderDef>
              <button hlmBtn size="sm" variant="ghost" (click)="handleTaskSortChange('id')">
                Id
                <ng-icon hlm class="ml-3" size="sm" name="lucideArrowUpDown" />
              </button>
            </hlm-th>
            <hlm-td truncate *brnCellDef="let element">
              {{ element.id }}
            </hlm-td>
          </brn-column-def>
          <brn-column-def name="title" class="w-60 flex-1">
            <hlm-th *brnHeaderDef>
              <button hlmBtn size="sm" variant="ghost" (click)="handleTaskSortChange('title')">
                Title
                <ng-icon hlm class="ml-3" size="sm" name="lucideArrowUpDown" />
              </button>
            </hlm-th>
            <hlm-td truncate *brnCellDef="let element" class="font-medium">
              <div
                class="text-foreground inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold"
              >
                {{ element.type }}
              </div>
              {{ element.title }}
            </hlm-td>
          </brn-column-def>
          <brn-column-def name="status" class="w-32">
            <hlm-th *brnHeaderDef>
              <button hlmBtn size="sm" variant="ghost" (click)="handleTaskSortChange('status')">
                Status
                <ng-icon hlm class="ml-3" size="sm" name="lucideArrowUpDown" />
              </button>
            </hlm-th>
            <hlm-td truncate *brnCellDef="let element">
              <div class="flex items-center">
                <ng-icon
                  hlm
                  class="text-muted-foreground mr-2"
                  size="sm"
                  [name]="element.status | statusIcon"
                />
                <span>{{ element.status }}</span>
              </div>
            </hlm-td>
          </brn-column-def>
          <brn-column-def name="priority" class="w-32">
            <hlm-th *brnHeaderDef>
              <button hlmBtn size="sm" variant="ghost" (click)="handleTaskSortChange('priority')">
                Priority
                <ng-icon hlm class="ml-3" size="sm" name="lucideArrowUpDown" />
              </button>
            </hlm-th>
            <hlm-td *brnCellDef="let element">
              <div class="flex items-center">
                <ng-icon
                  hlm
                  class="text-muted-foreground mr-2"
                  size="sm"
                  [name]="element.priority | priorityIcon"
                />
                {{ element.priority }}
              </div>
            </hlm-td>
          </brn-column-def>
          <brn-column-def name="actions" class="w-16">
            <hlm-th *brnHeaderDef></hlm-th>
            <hlm-td *brnCellDef="let element">
              <button
                hlmBtn
                variant="ghost"
                class="h-6 w-6 p-0.5"
                align="end"
                [brnMenuTriggerFor]="menu"
              >
                <ng-icon hlm size="sm" name="lucideEllipsis" />
              </button>

              <ng-template #menu>
                <hlm-menu>
                  <hlm-menu-label>Actions</hlm-menu-label>
                  <hlm-menu-separator />
                  <hlm-menu-group>
                    <button hlmMenuItem>Edit</button>
                  </hlm-menu-group>
                  <hlm-menu-separator />
                  <hlm-menu-group>
                    <button hlmMenuItem>
                      Delete
                      <span class="ml-auto text-xs tracking-widest opacity-60">⌘⌫</span>
                    </button>
                  </hlm-menu-group>
                </hlm-menu>
              </ng-template>
            </hlm-td>
          </brn-column-def>
          <div class="text-muted-foreground flex items-center justify-center p-20" brnNoDataRow>
            No data
          </div>
        </brn-table>
        <div
          class="mt-4 flex flex-col justify-between sm:flex-row sm:items-center"
          *brnPaginator="
            let ctx;
            totalElements: totalElements();
            pageSize: pageSize();
            onStateChange: _onStateChange
          "
        >
          <span class="text-muted-foreground text-sm">
            {{ selected().length }} of {{ totalElements() }} row(s) selected
          </span>
          <div class="mt-2 flex sm:mt-0">
            <brn-select
              class="inline-block"
              placeholder="{{ availablePageSizes[0] }}"
              [(ngModel)]="pageSize"
            >
              <hlm-select-trigger class="w-20 mr-1 inline-flex h-9">
                <hlm-select-value />
              </hlm-select-trigger>
              <hlm-select-content>
                @for (size of availablePageSizes; track size) {
                  <hlm-option [value]="size">
                    {{ size === 10000 ? 'All' : size }}
                  </hlm-option>
                }
              </hlm-select-content>
            </brn-select>

            <div class="flex space-x-1">
              <button
                size="sm"
                variant="outline"
                hlmBtn
                [disabled]="!ctx.decrementable()"
                (click)="ctx.decrement()"
              >
                Previous
              </button>
              <button
                size="sm"
                variant="outline"
                hlmBtn
                [disabled]="!ctx.incrementable()"
                (click)="ctx.increment()"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DataTableUseComponent {
  private readonly _tasksService = inject(TasksService);

  protected readonly trackBy: TrackByFunction<Task> = (_: number, p: Task) => p.id;
  protected readonly totalElements = computed(() => this._tasksService._filteredTasks().length);
  protected readonly availablePageSizes = [5, 10, 20, 10000];
  protected readonly pageSize = signal(this.availablePageSizes[1]); // default to page size 10

  protected readonly allDisplayedColumns = this._tasksService.getAllDisplayedColumns();
  protected readonly selected = this._tasksService.getSelected();
  protected readonly checkboxState = this._tasksService.getCheckboxState();
  protected readonly tableSource = this._tasksService.getFilteredSortedPaginatedTasks();

  protected readonly isPaymentSelected = (payment: Task) =>
    this._tasksService.isTaskSelected(payment);

  handleTaskSortChange(column: SortingColumns) {
    this._tasksService.handleTaskSortChange(column);
  }

  togglePayment(payment: Task) {
    this._tasksService.toggleTask(payment);
  }

  handleHeaderCheckboxChange() {
    this._tasksService.handleHeaderCheckboxChange();
  }

  protected readonly _onStateChange = ({ startIndex, endIndex }: PaginatorState) =>
    this._tasksService.setDisplayedIndices(startIndex, endIndex);
}
