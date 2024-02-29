'use client';

import {
  assistantAtom,
  assistantFileAtom,
  fileAtom,
  runAtom,
  runStateAtom,
  threadAtom,
} from '@/store';
import { useAtom } from 'jotai';
import React from 'react';

export function Header() {
  const [assistant] = useAtom(assistantAtom);
  const [file] = useAtom(fileAtom);
  const [assistantFile] = useAtom(assistantFileAtom);
  const [thread] = useAtom(threadAtom);
  const [run] = useAtom(runAtom);
  const [runState] = useAtom(runStateAtom);

  return (
    <header className="flex flex-row justify-between text-xl font-semibold">
      <div className="flex flex-1 flex-col items-center">
        <span>Assistant:</span>
        <span className="text-xs text-blue-500">{assistant?.id}</span>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <span>File:</span>
        <span className="text-xs text-blue-500">{file}</span>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <span>Assistant File:</span>
        <span className="text-xs text-blue-500">{assistantFile}</span>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <span>Thread:</span>
        <span className="text-xs text-blue-500">{thread?.id}</span>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <span>Run:</span>
        <span className="text-xs text-blue-500">{run?.id}</span>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <span>Run State:</span>
        <span className="text-xs text-blue-500">{runState}</span>
      </div>
    </header>
  );
}
