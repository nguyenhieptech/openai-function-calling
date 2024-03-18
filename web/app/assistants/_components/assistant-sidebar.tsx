'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArchiveX, LucideIcon, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';

type LinkType = {
  id: string;
  title: string;
  icon: LucideIcon;
  variant: string;
};

const navLinks: LinkType[] = [
  {
    id: '1',
    title: 'Archive',
    icon: ArchiveX,
    variant: 'ghost',
  },
  {
    id: '2',
    title: 'Trash',
    icon: Trash2,
    variant: 'ghost',
  },
  {
    id: '3',
    title: 'Settings',
    icon: Settings,
    variant: 'ghost',
  },
];

export function AssistantSidebar() {
  return (
    <aside>
      <nav className="grid gap-1 px-2">
        {navLinks.map((navLink) => (
          <Link
            key={navLink.id}
            href="#"
            className={cn(
              // @ts-expect-error
              buttonVariants({ variant: navLink.variant, size: 'sm' }),
              // navLink.variant === 'default' &&
              //   'dark:bg-muted dark:hover:bg-muted dark:hover:text-muted-foreground',
              'w-full justify-start text-sm'
            )}
          >
            <navLink.icon className="mr-2 h-4 w-4" />
            {navLink.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
