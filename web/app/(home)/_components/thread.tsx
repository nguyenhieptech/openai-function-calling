'use client';

import { Button } from '@/components/ui/button';
import { http } from '@/lib/utils';
import { messagesAtom, threadAtom } from '@/store';
import { useAtom } from 'jotai';
import { Thread } from 'openai/resources/beta/threads/threads.mjs';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export function ThreadComponent() {
  const [thread, setThread] = useAtom(threadAtom);
  const [, setMessages] = useAtom(messagesAtom);

  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleCreate() {
    setCreating(true);
    try {
      const response = await http.post<Thread>('threads');

      const newThread = response.data;
      console.log('response', newThread);
      setThread(newThread);
      localStorage.setItem('thread', JSON.stringify(newThread));
      toast.success('Successfully created thread', {
        position: 'bottom-center',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to create thread', { position: 'bottom-center' });
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete() {
    if (!thread) throw new Error('No thread to delete');

    setDeleting(true);
    try {
      const response = await http.delete<Thread>(`threads/${thread.id}`);

      const deletedThread = response.data;
      console.log('response', deletedThread);
      setThread(null);
      localStorage.removeItem('thread');
      setMessages([]);
      toast.success('Successfully deleted thread', {
        position: 'bottom-center',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete thread', { position: 'bottom-center' });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mb-8 flex flex-col">
      <h1 className="mb-4 text-4xl font-semibold">Thread</h1>
      <div className="flex w-full flex-row gap-x-4">
        <Button onClick={handleCreate}>{creating ? 'Creating...' : 'Create'}</Button>
        <Button onClick={handleDelete} disabled={!thread}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}
