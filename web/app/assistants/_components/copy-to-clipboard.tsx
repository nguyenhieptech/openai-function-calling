'use client';

import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  contentToCopy: string;
}

export function CopyToClipboard({
  className,
  contentToCopy,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  function handleCopy() {
    if (isCopied) return;
    copyToClipboard(contentToCopy);
  }

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={className} {...props}>
      <Button
        variant="secondary"
        size="icon"
        className="h-6 w-6"
        onClick={handleCopy}
        suppressHydrationWarning
      >
        {isCopied ? (
          <CheckIcon className="h-3 w-3 text-emerald-400" />
        ) : (
          <CopyIcon className="h-3 w-3 text-foreground" />
        )}
        <span className="sr-only">Click to copy</span>
      </Button>
    </div>
  );
}
