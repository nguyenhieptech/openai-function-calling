'use client';

import {
  assistantAtom,
  assistantFileAtom,
  fileAtom,
  isValidRunState,
  runAtom,
  runStateAtom,
  threadAtom,
} from '@/store';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { AssistantComponent } from './assistant';
import { AssistantFileComponent } from './assistant-file';
import { ChatContainer } from './chat-container';
import { Header } from './header';
import { RunComponent } from './run';
import { StockPrices } from './stock-price';
import { ThreadComponent } from './thread';

export function HomePage() {
  const [, setAssistant] = useAtom(assistantAtom);
  const [, setFile] = useAtom(fileAtom);
  const [, setAssistantFile] = useAtom(assistantFileAtom);
  const [, setThread] = useAtom(threadAtom);
  const [, setRun] = useAtom(runAtom);
  const [, setRunState] = useAtom(runStateAtom);

  // Load default data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localAssistant = localStorage.getItem('assistant');
      if (localAssistant) {
        setAssistant(JSON.parse(localAssistant));
      }
      const localFile = localStorage.getItem('file');
      if (localFile) {
        setFile(localFile);
      }
      const localAssistantFile = localStorage.getItem('assistantFile');
      if (localAssistantFile) {
        setAssistantFile(localAssistantFile);
      }
      const localThread = localStorage.getItem('thread');
      if (localThread) {
        setThread(JSON.parse(localThread));
      }
      const localRun = localStorage.getItem('run');
      if (localRun) {
        setRun(JSON.parse(localRun));
      }
      const localRunState = localStorage.getItem('runState');
      if (localRunState && isValidRunState(localRunState)) {
        setRunState(localRunState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex flex-col">
      <Header />
      <section className="mt-20 flex flex-row gap-x-10">
        {/* Actions */}
        {/* <div className="flex w-full flex-col">
          <AssistantComponent />
          <AssistantFileComponent />
          <ThreadComponent />
          <RunComponent />
        </div> */}
        {/* Chat Assistant */}
        <div className="w-1/3">
          <ChatContainer />
        </div>
        {/* <div className="w-full">
          <StockPrices />
        </div> */}
      </section>
    </main>
  );
}
