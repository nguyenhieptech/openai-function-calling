'use client';

import { ModeToggle } from '@/components/mode-toggle';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AssistantChat } from './assistant-chat';
import { AssistantCreationPanel } from './assistant-creation-panel';
import { AssistantSidebar } from './assistant-sidebar';

export function AssistantClient() {
  return (
    <>
      <header className="flex h-16 items-center justify-between bg-card px-8 shadow-sm">
        <h1 className="text-lg font-bold sm:text-2xl">Assistant Playground</h1>
        <ModeToggle />
      </header>

      {/* main height equals 100vh minus header height (h-16), line 17 */}
      <main className="h-[calc(100vh-4rem)]">
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel
              className="hidden bg-card/70 pt-8 md:flex"
              defaultSize={10}
              minSize={10}
              maxSize={15}
            >
              <AssistantSidebar />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              className="mt-8 hidden md:flex"
              defaultSize={30}
              minSize={30}
              maxSize={35}
            >
              <AssistantCreationPanel />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="mt-8 md:w-2/3" defaultSize={60}>
              <AssistantChat />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </main>
    </>
  );
}
