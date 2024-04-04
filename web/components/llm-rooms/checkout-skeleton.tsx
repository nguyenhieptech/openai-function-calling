'use client';

export function CheckoutSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-[30px] w-full flex-row gap-2 rounded-lg bg-zinc-900 p-2 text-left" />
      <div className="flex h-[90px] w-full flex-row gap-2 rounded-lg bg-zinc-900 p-2 text-left" />
    </div>
  );
}
