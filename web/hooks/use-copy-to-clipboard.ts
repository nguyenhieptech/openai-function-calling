import { useState } from 'react';

export function useCopyToClipboard({ timeout = 2000 }: { timeout?: number }) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyToClipboard(value: string) {
    if (!value) return;
    if (typeof window === 'undefined' || !navigator.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }

  return { isCopied, copyToClipboard };
}
