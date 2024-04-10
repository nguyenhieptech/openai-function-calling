'use client';

export function RoomSkeleton() {
  return (
    <div className="flex max-w-full flex-row gap-4 space-y-3 border border-transparent shadow-sm hover:border-primary-foreground">
      <div className="w-fit overflow-hidden rounded-md">
        <img
          alt={`skeleton`}
          loading="lazy"
          width="150"
          height="150"
          decoding="async"
          data-nimg="1"
          className="aspect-square h-auto w-auto max-w-[100px] object-cover transition-all hover:scale-105"
        />
      </div>
      <div className="flex w-full flex-col justify-between space-y-1 text-sm">
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xl font-medium leading-none"></h3>
            <span></span>
          </div>
          <p className="text-xs text-muted-foreground"></p>
        </div>
      </div>
    </div>
  );
}
