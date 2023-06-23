'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { PostValidator } from '@/app/api/post/route';
import { FormEvent, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export function PostSubmitForm() {
  const router = useRouter();
  const [post, setPost] = useState({
    title: '',
    url: '',
    text: '',
  });
  const postMutation = useMutation({
    mutationFn: async () => {
      const { title, url, text } = post;
      const payload: PostValidator = {
        title,
        url,
        text,
      };

      const { data } = await axios.post('/api/post', payload);

      return data;
    },
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.log({ error });
        if (error.response?.status === 400) {
          alert(error.response.data[0].message);
        }
      }
    },
  });

  const submitPost = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    postMutation.mutate();
  };

  return (
    <div className="p-4">
      <form>
        <div className="flex items-center">
          <Label className="pr-2">title</Label>
          <Input
            onChange={(e) => {
              const { value } = e.target;
              setPost((prev) => ({
                ...prev,
                title: value,
              }));
            }}
            id="title"
            name="title"
          />
        </div>

        <div className="flex items-center">
          <Label className="pr-2">url</Label>
          <Input
            onChange={(e) => {
              const { value } = e.target;
              setPost((prev) => ({
                ...prev,
                url: value,
              }));
            }}
            id="url"
            name="url"
          />
        </div>

        <div className="flex items-center">
          <Label className="pr-2">text</Label>
          <Textarea
            onChange={(e) => {
              const { value } = e.target;
              setPost((prev) => ({
                ...prev,
                text: value,
              }));
            }}
            id="text"
            name="text"
          />
        </div>
        <Button onClick={submitPost} type="submit">
          submit
        </Button>
      </form>
    </div>
  );
}
