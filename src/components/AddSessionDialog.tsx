"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createLogEntry } from '@/app/actions';
import { formatTime } from '@/lib/utils';
import type { LogEntry } from '@/components/SessionLog';

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters."
  }),
});

type AddSessionFormValues = z.infer<typeof formSchema>;

interface AddSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  elapsedTime: number;
  onLogSuccess: (log: LogEntry) => void;
}

export function AddSessionDialog({
  open,
  onOpenChange,
  elapsedTime,
  onLogSuccess,
}: AddSessionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddSessionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(values: AddSessionFormValues) {
    setIsSubmitting(true);
    try {
      const formattedTime = formatTime(elapsedTime);
      const result = await createLogEntry({
        elapsedTime: formattedTime,
        description: values.description,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if(result.log) {
        onLogSuccess(result.log);
        onOpenChange(false);
        form.reset();
        toast({
          title: "Session Logged",
          description: "Your session log has been generated.",
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate session log. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Session</DialogTitle>
          <DialogDescription>
            Add a description for your work session of <span className="font-bold">{formatTime(elapsedTime)}</span> to generate a log entry.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Drafted a response to the plaintiff's motion for summary judgment..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Log Entry
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
