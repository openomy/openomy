'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon as LoaderIcon, CheckCircle2Icon } from 'lucide-react';
import { Input } from '@repo/ui/components/ui/input';
import { Button } from '@repo/ui/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { z } from 'zod';
import { WaitlistSchema } from '@/lib/schema';

type WaitlistFormValues = z.infer<typeof WaitlistSchema>;

export function Waitlist({
  className,
  backFillRepoUrl = true,
}: {
  className?: string;
  backFillRepoUrl?: boolean;
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { owner, repo } = useParams();

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(WaitlistSchema),
    defaultValues: {
      email: '',
      repoUrl:
        backFillRepoUrl && owner && repo
          ? `https://github.com/${owner}/${repo}`
          : '',
    },
  });

  async function onSubmit(values: WaitlistFormValues) {
    console.log(values);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email, repoUrl: values.repoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error);
      }

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success state
      setIsSubmitted(true);
    } catch (error) {
      toast.error((error as Error).message, { position: 'top-center' });
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between px-2 py-4 text-card-foreground ',
        className,
      )}
    >
      {!isSubmitted && (
        <div className="space-y-6">
          <div className="space-y-4 flex flex-col">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to Showcase Contributions for Your Repository?
            </h2>
            <div className="text-muted-foreground">
              Leave your GitHub repository link and email address, and we’ll
              notify you when your repository is ready.
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 lg:w-sm max-w-sm">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="bg-[#161616] text-gray-200 border-[#333333] focus-visible:ring-0 focus-visible:border-[#ffff00] shadow-none placeholder:text-gray-500"
                            placeholder="Email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="repoUrl"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="bg-[#161616] text-gray-200 border-[#333333] focus-visible:ring-0 focus-visible:border-[#ffff00] shadow-none placeholder:text-gray-500"
                            placeholder="Github repository URL"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <Button
                  type="submit"
                  variant="default"
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    'w-full cursor-pointer bg-[#ffff00] border-[#ffff00] hover:bg-[#FFFF00]/90 font-semibold text-black shadow-sm transition-all duration-200 hover:shadow-md',
                  )}
                >
                  {form.formState.isSubmitting && (
                    <LoaderIcon className="animate-spin h-4 w-4" />
                  )}

                  {form.formState.isSubmitting
                    ? 'Unlocking...'
                    : 'Unlock Your Access'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-4"
        >
          <div className="flex items-center gap-x-2">
            <CheckCircle2Icon className="w-7 h-7 text-green-600" />
            <h3 className="text-2xl font-semibold">Request Received!</h3>
          </div>

          <p className="text-muted-foreground mx-auto">
            We&apos;ll notify you by email when your repository is ready.
          </p>
        </motion.div>
      )}
    </div>
  );
}
