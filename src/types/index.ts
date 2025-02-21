import { ColumnDef } from '@tanstack/angular-table';

export type CustomColumnDef<TData> = ColumnDef<TData> & {
  meta?: {
    align?: 'left' | 'center' | 'right';
  };
};
