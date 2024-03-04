import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, http } from '@/lib/utils';
import { messagesAtom, threadAtom } from '@/store';
import { useAtom } from 'jotai';
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function ChatContainer() {
  const [thread] = useAtom(threadAtom);
  const [messages, setMessages] = useAtom(messagesAtom);

  const [userInput, setUserInput] = useState('');
  const [messageValue, setMessageValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      setIsFetching(true);
      if (!thread) return;

      try {
        http
          .get<ThreadMessage[]>(`threads/messages?thread_id=${thread.id}`)
          .then((response) => {
            let newMessages = response.data;

            // Sort messages in descending order by createdAt
            newMessages = newMessages.sort(
              (a, b) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            setMessages(newMessages);
          });
      } catch (error) {
        console.log('error', error);
        toast.error('Error fetching messages', { position: 'bottom-center' });
      } finally {
        setIsFetching(false);
      }
    }

    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread]);

  async function sendMessage() {
    if (!thread) return;
    setIsSending(true);

    try {
      const response = await http.post<ThreadMessage>(
        `threads/messages?thread_id=${thread.id}&message=${userInput}`,
        { message: userInput, threadId: thread.id }
      );
      const newMessage = response.data;
      console.log('newMessage', newMessage);
      setMessages([...messages, newMessage]);
      setUserInput('');

      toast.success('Successfully sent message', {
        position: 'bottom-center',
      });
    } catch (error) {
      console.log('error', error);
      toast.error('Error sending message', { position: 'bottom-center' });
    } finally {
      setIsSending(false);
    }
  }

  async function handleChatCompletion() {
    // if (!thread) return;
    setIsSending(true);

    try {
      const response = await http.post('chat-completions');
      const newMessage = response.data;
      console.log('newMessage', newMessage);
      // setMessages([...messages, newMessage]);
      setUserInput('');
      setMessageValue(newMessage.message.content);

      toast.success('Successfully sent message', {
        position: 'bottom-center',
      });
    } catch (error) {
      console.log('error', error);
      toast.error('Error sending message', { position: 'bottom-center' });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex h-full max-h-screen w-full flex-col rounded-lg border-2 border-solid border-border p-10">
      {/* Messages */}
      <div className="flex h-full max-h-[calc(100vh-400px)] flex-col overflow-y-auto rounded-lg border-2 border-solid border-border p-6">
        {isSending && <div className="m-auto font-bold">Fetching messages.</div>}
        {!isFetching && messages.length === 0 && (
          <div className="m-auto font-bold">No messages found for thread.</div>
        )}
        {/* {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'mb-3 w-fit rounded-lg px-4 py-2 text-lg text-white',
              message.role === 'user' ? ' ml-auto bg-blue-500 text-right' : ' bg-gray-500'
            )}
          >
            {message.content[0].type === 'text' ? message.content[0].text.value : null}
          </div>
        ))} */}
        {messageValue}
      </div>

      {/* Input */}
      <div className="mt-5 flex w-full flex-row">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <Button
          // disabled={!thread || isSending || message === ''}
          disabled={isSending}
          onClick={() => handleChatCompletion()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
