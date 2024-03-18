'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCopyToClipboard } from '@/hooks';
import { http } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, CopyIcon, Plus, Trash2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { Assistant } from 'openai/resources/beta/assistants/assistants.mjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { CopyToClipboard } from './copy-to-clipboard';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 5 characters.',
  }),
  instructions: z.string().min(2, {
    message: 'Instructions must be at least 5 characters.',
  }),
});

export function AssistantCreationPanel() {
  const [isCreating, setIsCreating] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [isListMessageFilesLoading, setIsListMessageFilesLoading] = useState(false);
  const [currentAssistantId, setCurrentAssistantId] = useQueryState('assistant_id');

  const [assistantsList, setAssistantsList] = useState<Assistant[]>([]);

  useEffect(() => {
    async function handleListAssistant() {
      setIsListing(true);
      try {
        const response = await http.get<Assistant[]>(`assistants`);
        const assistants = response.data;
        console.log('assistants', assistants);
        setAssistantsList(assistants);

        toast.success(`Assistants:\n${assistants.map((a) => `${a.name + '\n'}`)} `, {
          position: 'bottom-center',
        });
      } catch (error) {
        console.log('error', error);
        toast.error('Error listing assistants', { position: 'bottom-center' });
      } finally {
        setIsListing(false);
      }
    }

    async function handleListMessageFiles() {
      setIsListMessageFilesLoading(true);
      try {
        const response = await http.get<Assistant[]>(`assistants`);
        const assistants = response.data;
        console.log('assistants', assistants);
        setAssistantsList(assistants);

        toast.success(`Assistants:\n${assistants.map((a) => `${a.name + '\n'}`)} `, {
          position: 'bottom-center',
        });
      } catch (error) {
        console.log('error', error);
        toast.error('Error listing assistants', { position: 'bottom-center' });
      } finally {
        setIsListMessageFilesLoading(false);
      }
    }

    handleListAssistant();
    handleListMessageFiles();
  }, [currentAssistantId]);

  const [isDeleting, setIsDeleting] = useState(false);

  // async function handleCreateAssistant() {
  //   setIsCreating(true);
  //   try {
  //     const response = await http.post<Assistant>('assistants');
  //     const newAssistant = response.data;
  //     setCurrentAssistantId(newAssistant.id);

  //     toast.success('Successfully created assistant', {
  //       position: 'bottom-center',
  //     });
  //   } catch (error) {
  //     console.log('error', error);
  //     toast.error('Error creating assistant', { position: 'bottom-center' });
  //   } finally {
  //     setIsCreating(false);
  //   }
  // }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      instructions: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreating(true);
    console.log(values);
    try {
      const response = await http.post<Assistant>('assistants', {
        instructions: values.instructions,
        name: values.name,
      });

      const newAssistant = response.data;
      setCurrentAssistantId(newAssistant.id);

      toast.success('Successfully created assistant', {
        position: 'bottom-center',
      });
    } catch (error) {
      console.log('error', error);
      toast.error('Error creating assistant', { position: 'bottom-center' });
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteAssistant() {
    setIsDeleting(true);
    try {
      await http.delete(`assistants/${currentAssistantId}`);
      toast.success('Successfully deleted assistant', {
        position: 'bottom-center',
      });
    } catch (error) {
      console.log('error', error);
      toast.error('Error deleting assistant', { position: 'bottom-center' });
    } finally {
      setIsDeleting(false);
      setCurrentAssistantId(null);
    }
  }

  return (
    <section className="container w-full space-y-6 px-6">
      <Select value={currentAssistantId!} onValueChange={setCurrentAssistantId}>
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Assistant" />
        </SelectTrigger>
        <SelectContent>
          {assistantsList.map((assistant) => {
            return (
              <SelectItem key={assistant.id} value={assistant.id!}>
                {assistant.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <div className="mt-3 flex items-center justify-start space-x-3">
        <p className="text-xs text-muted-foreground">{currentAssistantId}</p>
        <Tooltip>
          <TooltipTrigger>
            <div>
              <CopyToClipboard contentToCopy={currentAssistantId!} />
            </div>
          </TooltipTrigger>
          <TooltipContent>Click to copy</TooltipContent>
        </Tooltip>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a user friendly name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    className="max-h-[20rem]"
                    placeholder="You are a helpful assistant"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mb-4 flex items-center space-x-2 px-3 text-sm"
            type="submit"
            disabled={isCreating}
          >
            <Plus className="-ml-1 h-4 w-4" />
            <p>Create a new assistant</p>
          </Button>
        </form>
      </Form>

      <Button
        className="text-sm"
        variant="destructive"
        size="icon"
        disabled={isDeleting}
        onClick={handleDeleteAssistant}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </section>
  );
}
