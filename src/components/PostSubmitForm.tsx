'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { postValidatorSchema } from '@/lib/validator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type FormData = z.infer<typeof postValidatorSchema>;

export function PostSubmitForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      url: '',
      text: '',
    },
    resolver: zodResolver(postValidatorSchema),
  });
  const postMutation = useMutation({
    mutationFn: async ({ text, title, url }: FormData) => {
      const payload: FormData = {
        title,
        url,
        text,
      };

      const { data } = await axios.post('/api/post', payload);

      return data;
    },
    onSuccess: () => {
      alert('success');
      router.refresh();
    },
    onError: (error) => {
      // TODO:
      // Since we are using zod to validate the form, we can't get the error message from the server.
      // Error should potentially be different, maybe 500?
      if (error instanceof AxiosError) {
        console.log({ error });
        if (error.response?.status === 400) {
          alert(error.response.data[0].message);
        }
      }
    },
  });

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit((data) => postMutation.mutate(data))}>
        <div className="flex items-center">
          <Label className="pr-2">title</Label>
          <Input {...register('title')} id="title" name="title" />
        </div>

        <div className="flex items-center">
          <Label className="pr-2">url</Label>
          <Input {...register('url')} id="url" name="url" />
          {errors.url && <p className="text-red-500">{errors.url.message}</p>}
        </div>

        <div className="flex items-center">
          <Label className="pr-2">text</Label>
          <Textarea {...register('text')} id="text" name="text" />
        </div>
        <Button>submit</Button>
      </form>
    </div>
  );
}
