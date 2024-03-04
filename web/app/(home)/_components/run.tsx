import { Button } from '@/components/ui/button';
import { http } from '@/lib/utils';
import {
  assistantAtom,
  messagesAtom,
  runAtom,
  runStateAtom,
  stockPricesAtom,
  threadAtom,
} from '@/store';
import { useAtom } from 'jotai';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs';
import {
  Run,
  RunSubmitToolOutputsParams,
} from 'openai/resources/beta/threads/runs/runs.mjs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function RunComponent() {
  const [thread] = useAtom(threadAtom);
  const [run, setRun] = useAtom(runAtom);
  const [, setMessages] = useAtom(messagesAtom);
  const [assistant] = useAtom(assistantAtom);
  const [runState, setRunState] = useAtom(runStateAtom);
  const [, setStockPrices] = useAtom(stockPricesAtom);

  const [creating, setCreating] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [pollingIntervalId, setPollingIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clean up polling on unmount
    return () => {
      if (pollingIntervalId) {
        clearInterval(pollingIntervalId);
      }
    };
  }, [pollingIntervalId]);

  function startPolling(runId: string) {
    if (!thread) return;
    const intervalId = setInterval(async () => {
      try {
        const response = await http.get<Run>(
          `threads/runs?thread_id=${thread.id}&assistant_id=${runId}`
        );
        const updatedRun = response.data;

        setRun(updatedRun);
        setRunState(updatedRun.status);

        if (['cancelled', 'failed', 'completed', 'expired'].includes(updatedRun.status)) {
          clearInterval(intervalId);
          setPollingIntervalId(null);
          fetchMessages();
        }
      } catch (error) {
        console.error('Error polling run status:', error);
        clearInterval(intervalId);
        setPollingIntervalId(null);
      }
    }, 500);

    setPollingIntervalId(intervalId);
  }

  async function handleCreate() {
    if (!assistant || !thread) return;

    setCreating(true);
    try {
      const response = await http.get<Run>(
        `threads/runs?thread_id=${thread.id}&assistant_id=${assistant.id}`
      );

      const newRun = response.data;
      setRunState(newRun.status);
      setRun(newRun);
      toast.success('Run created', { position: 'bottom-center' });
      localStorage.setItem('run', JSON.stringify(newRun));

      // Start polling after creation
      startPolling(newRun.id);
    } catch (error) {
      toast.error('Error creating run.', { position: 'bottom-center' });
      console.error(error);
    } finally {
      setCreating(false);
    }
  }

  async function handleCancel() {
    if (!run || !thread) return;

    setCanceling(true);
    try {
      const response = await http.get<Run>(
        `threads/runs?run_id=${run.id}&thread_id=${thread.id}`
      );

      const newRun = response.data;
      setRunState(newRun.status);
      setRun(newRun);
      toast.success('Run canceled', { position: 'bottom-center' });
      localStorage.setItem('run', JSON.stringify(newRun));
    } catch (error) {
      toast.error('Error canceling run.', { position: 'bottom-center' });
      console.error(error);
    } finally {
      setCanceling(false);
    }
  }

  async function fetchMessages() {
    if (!thread) return;

    try {
      http
        .get<ThreadMessage[]>(`threads/messages?thread_id=${thread.id}`)
        .then((response) => {
          let newMessages = response.data;

          // Sort messages in descending order by createdAt
          newMessages = newMessages.sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          setMessages(newMessages);
        });
    } catch (error) {
      console.log('error', error);
      toast.error('Error fetching messages', { position: 'bottom-center' });
    }
  }

  // Example tool calls: [TSLA, MSFT, AAPL]
  // Goal: Fetch stock prices for each symbol
  // Populate toolOutputs with all of the new stock prices [TSLA: 100, MSFT : 150, AAPL]
  // Submit toolOutputs to the run in  a single request
  async function handleSubmitAction() {
    setStockPrices([]);
    const toolOutputs: RunSubmitToolOutputsParams.ToolOutput[] = [];

    for (const toolCall of run?.required_action?.submit_tool_outputs.tool_calls ?? []) {
      console.log(`toolCall`, toolCall);
      if (toolCall.function.name === 'getStockInfo') {
        const { symbol, logoURL, success, errorMessage } = JSON.parse(
          toolCall.function.arguments
        );
        if (!success || errorMessage) {
          toast.error(errorMessage ?? 'Something went wrong fetching data for stocks', {
            position: 'bottom-center',
          });
        }
        if (!symbol) {
          toast.error('No symbol found', { position: 'bottom-center' });
        }

        try {
          const response = await http.get<{
            price: number | null;
            success: boolean;
            error?: string;
          }>(`stock?symbol=${symbol}`);

          const { error, success, price } = response.data;
          if (!success || error || !price) {
            toast.error(error ?? 'Something went wrong fetching stock', {
              position: 'bottom-center',
            });
            return;
          }

          const newStockPrice = {
            symbol,
            logoURL: logoURL ?? '',
            price,
          };

          console.log('new stock price', newStockPrice);

          toolOutputs.push({
            tool_call_id: toolCall.id,
            output: JSON.stringify(newStockPrice),
          });

          setStockPrices((prev) => [...prev, newStockPrice]);
        } catch (error) {
          console.log('Error fetching stock', error);
          toast.error('Error fetching stock', { position: 'bottom-center' });
        }
      } else {
        throw new Error(`Unknown tool call function: ${toolCall.function.name}`);
      }
    }

    console.log('toolOutputs', toolOutputs);
    if (toolOutputs.length > 0) {
      const response = await http.post<{ run: Run; success: boolean }>(
        'runs/submit-tool-output',
        {
          runId: run?.id,
          threadId: thread?.id,
          toolOutputs: toolOutputs,
        }
      );

      console.log('Response data from submit tool output', response.data);

      if (response.data.success) {
        toast.success('Submitted action', { position: 'bottom-center' });
        setRun(response.data.run);
      } else {
        toast.success('Submitted action', { position: 'bottom-center' });
      }
    }
  }

  return (
    <div className="mb-8 flex flex-col">
      <h1 className="mb-4 text-4xl font-semibold">Run</h1>
      <div className="flex w-full flex-row gap-x-4">
        <Button onClick={handleCreate} disabled={creating || !assistant || !thread}>
          {creating ? 'Creating...' : 'Create'}
        </Button>
        <Button onClick={handleCancel} disabled={['N/A'].includes(runState) || !run}>
          {canceling ? 'Canceling...' : 'Cancel'}
        </Button>
        <Button onClick={handleSubmitAction} disabled={runState !== 'requires_action'}>
          Submit Action
        </Button>
      </div>
    </div>
  );
}
