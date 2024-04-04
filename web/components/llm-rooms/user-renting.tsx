import { Purchase } from '@/lib/schemas/purchase.schema';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './purchase-table';

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'room.name',
    header: 'Room',
  },
  {
    accessorKey: 'room.price',
    header: 'Price',
  },
  {
    accessorKey: 'invoiceUrl',
    header: 'Invoice',
  },
];

export function UserRenting({ purchases }: { purchases: Purchase[] }) {
  return (
    <div className="relative mx-auto max-w-2xl" id="user-purchases">
      <h1 className="mb-4 text-2xl font-bold">Your Purchases</h1>
      <div className="space-y-4">
        <DataTable columns={columns} data={purchases} />
      </div>
    </div>
  );
}
