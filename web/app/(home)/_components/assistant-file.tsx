'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { http } from '@/lib/utils';
import { assistantAtom, assistantFileAtom, fileAtom } from '@/store';
import { useAtom } from 'jotai';
import {
  AssistantFile,
  AssistantFilesPage,
} from 'openai/resources/beta/assistants/files.mjs';
import { FileObject } from 'openai/resources/files.mjs';
import React, { ChangeEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export function AssistantFileComponent() {
  const [assistant] = useAtom(assistantAtom);
  const [file, setFile] = useAtom(fileAtom);
  const [assistantFile, setAssistantFile] = useAtom(assistantFileAtom);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [listing, setListing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      handleUpload(file);
    } else {
      toast.error('No file selected', { position: 'bottom-center' });
    }
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Send the FormData object directly
      const response = await http.post<{ file: FileObject }>('file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedFile = response.data.file;

      console.log('response', uploadedFile);
      toast.success('Successfully uploaded file', {
        position: 'bottom-center',
      });
      setFile(uploadedFile.id);
      localStorage.setItem('file', uploadedFile.id);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file', { position: 'bottom-center' });
    } finally {
      setUploading(false);
    }
  }

  async function handleCreate() {
    if (!file || !assistant) {
      throw new Error('No file or assistant');
    }

    setCreating(true);
    try {
      const response = await http.get<{ assistantFile: AssistantFile }>(
        `assistant-file/create?assistant_id=${assistant.id}&file_id=${file}`
      );

      const assistantFile = response.data.assistantFile;

      console.log('assistantFile', assistantFile);
      toast.success('Successfully created assistant file', {
        position: 'bottom-center',
      });
      setAssistantFile(assistantFile.id);
      localStorage.setItem('assistantFile', assistantFile.id);
    } catch (error) {
      console.error('Error creating assistant file:', error);
      toast.error('Error creating assistant file', {
        position: 'bottom-center',
      });
    } finally {
      setCreating(false);
    }
  }

  async function handleList() {
    if (!assistant) {
      throw new Error('No assistant');
    }

    setListing(true);
    try {
      const response = await http.get<{
        assistantFiles: AssistantFilesPage;
      }>(`assistant-file/list?assistant_id=${assistant.id}`);

      const fetchedAssistantFiles = response.data.assistantFiles;

      console.log('fetchedAssistantFiles', fetchedAssistantFiles);

      toast.success(
        `Assistant Files:\n${fetchedAssistantFiles.data.map((af) => `${af.id + '\n'}`)} `,
        {
          position: 'bottom-center',
        }
      );
    } catch (error) {
    } finally {
      setListing(false);
    }
  }

  async function handleDelete() {
    if (!assistant || !assistantFile) {
      throw new Error('No assistant');
    }

    setDeleting(true);
    try {
      await http.get(
        `assistant-file/delete?assistant_id=${assistant?.id}&file_id=${file}`
      );

      toast.success('Successfully deleted assistant file', {
        position: 'bottom-center',
      });
      setAssistantFile('');
      localStorage.removeItem('assistantFile');
    } catch (error) {
      console.error('Error deleting assistant file:', error);
      toast.error('Error deleting assistant file', {
        position: 'bottom-center',
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mb-8 flex flex-col">
      <h1 className="mb-4 text-4xl font-semibold">Assistant File</h1>
      <div className="flex w-full flex-row gap-x-4">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
        <Button onClick={handleCreate} disabled={!assistant || !file}>
          {creating ? 'Creating...' : 'Create'}
        </Button>
        <Button onClick={handleList} disabled={!assistant}>
          {listing ? 'Listing...' : 'List'}
        </Button>
        <Button onClick={handleDelete} disabled={!assistant || !assistantFile}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}
