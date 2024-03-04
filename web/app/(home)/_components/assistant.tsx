'use client';

import { Button } from '@/components/ui/button';
import { http } from '@/lib/utils';
import { assistantAtom, fileAtom, messagesAtom } from '@/store';
import { useAtom } from 'jotai';
import { Assistant } from 'openai/resources/beta/assistants/assistants.mjs';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export function AssistantComponent() {
  const [assistant, setAssistant] = useAtom(assistantAtom);
  const [, setMessages] = useAtom(messagesAtom);
  const [file] = useAtom(fileAtom);

  const [creating, setCreating] = useState(false);
  const [modifying, setModifying] = useState(false);
  const [listing, setListing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleCreate() {
    setCreating(true);
    try {
      const response = await http.post<Assistant>('assistants');

      const newAssistant = response.data;
      console.log('newAssistant', newAssistant);
      setAssistant(newAssistant);
      localStorage.setItem('assistant', JSON.stringify(newAssistant));
      toast.success('Successfully created assistant', {
        position: 'bottom-center',
      });
    } catch (error) {
      console.log('error', error);
      toast.error('Error creating assistant', { position: 'bottom-center' });
    } finally {
      setCreating(false);
    }
  }

  async function handleList() {
    setListing(true);
    try {
      const response = await http.get<Assistant[]>(`assistants`);

      const assistants = response.data;
      console.log('assistants', assistants);

      toast.success(`Assistants:\n${assistants.map((a) => `${a.name + '\n'}`)} `, {
        position: 'bottom-center',
      });
    } catch (error) {
      console.log('error', error);
      toast.error('Error listing assistants', { position: 'bottom-center' });
    } finally {
      setListing(false);
    }
  }

  async function handleModify() {
    setModifying(true);
    try {
      const response = await http.put<Assistant>(
        `assistants/${assistant?.id}?file_id=${file}`
      );

      const newAssistant = response.data;
      setAssistant(newAssistant);
      localStorage.setItem('assistant', JSON.stringify(newAssistant));
      toast.success('Successfully created assistant', {
        position: 'bottom-center',
      });
    } catch (error) {
      console.log('error', error);
      toast.error('Error creating assistant', { position: 'bottom-center' });
    } finally {
      setModifying(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await http.delete(`assistants/${assistant?.id}`);
      setAssistant(null);
      localStorage.removeItem('assistant');
      toast.success('Successfully deleted assistant', {
        position: 'bottom-center',
      });
      setMessages([]);
    } catch (error) {
      console.log('error', error);
      toast.error('Error deleting assistant', { position: 'bottom-center' });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mb-8 flex flex-col">
      <h1 className="mb-4 text-4xl font-semibold">Assistant</h1>
      <div className="flex w-full flex-row gap-x-4">
        <Button onClick={handleCreate}>{creating ? 'Creating...' : 'Create'}</Button>
        <Button onClick={handleModify} disabled={!assistant || !file}>
          {modifying ? 'Modifying...' : 'Modify'}
        </Button>
        <Button onClick={handleList}>{listing ? 'Listing...' : 'List'}</Button>
        <Button onClick={handleDelete} disabled={!assistant}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}
