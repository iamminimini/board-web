import { ReactElement, useEffect, useState } from 'react';
import { RowType } from '@atlaskit/dynamic-table/dist/types/types';
import DynamicTable from '@atlaskit/dynamic-table';

export interface ColumnProps<T> {
  key: string;
  content: string;
  isSortable?: boolean;
  width?: number;
  render?: (
    column: ColumnProps<T>,
    item: T,
    rowIndex: number,
    colIndex: number
  ) => ReactElement;
}

// Table Props
interface TableProps<T> {
  columns: Array<ColumnProps<T>>;
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

function Table<T extends { id: number }>({
  columns,
  data,
  isLoading,
  emptyMessage,
}: TableProps<T>) {
  const [rows, setRows] = useState<RowType[]>([]);

  // 행 렌더링
  useEffect(() => {
    const newRows = data.map((item, rowIndex) => ({
      key: item.id.toString(),
      cells: columns.map((column, colIndex) => ({
        key: `${item.id}-${column.key}`,
        content: column.render
          ? column.render(column, item, rowIndex, colIndex)
          : (item[column.key as keyof T] ?? '').toString(), // render가 정의 되었으면 render 없다면 데이터 표시
      })),
    }));

    setRows(newRows);
  }, [data, columns]);

  const head = {
    cells: columns.map((col) => ({
      key: col.key,
      content: col.content,
      isSortable: col.isSortable,
      width: col.width,
    })),
  };

  return (
    <DynamicTable
      isFixedSize
      head={head}
      rows={rows}
      rowsPerPage={5}
      defaultPage={1}
      loadingSpinnerSize='large'
      isLoading={isLoading}
      emptyView={<div>{emptyMessage}</div>}
    />
  );
}

export default Table;
