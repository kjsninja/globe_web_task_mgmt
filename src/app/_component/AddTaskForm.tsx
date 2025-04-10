"use client"

import { FormEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { NewTask } from "@/lib/definitions"
import { NewTaskSchema } from "@/lib/dto/task"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { clientRequest } from "@/lib/utils"
import { z } from "zod"
import { toast } from "sonner"
import FullPageLoader from "./Loader"

interface TaskFormEvents {
  onSuccess: (state: boolean) => void
}

export default function AddTaskForm(props: TaskFormEvents) {
  const [loading, setLoading] = useState(false);
  const [mainError, setMainError] = useState('');

  // 1. Define your form.
  const form = useForm<z.infer<typeof NewTaskSchema>>({
    resolver: zodResolver(NewTaskSchema),
    defaultValues: {
      title: "",
      content: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof NewTaskSchema>) {
    setMainError('');
    setLoading(true);
    const resp = await clientRequest.post('/api/tasks', values);
    const result = await resp;
    if(result.status == 201){
      setLoading(false);
      props.onSuccess(false);
      toast.success("Success!", {
        description: <div className="text-black">You have added new task!</div>
      })
    }else{
      setMainError(result.data.message);
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={  form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="What's your task?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Put some content..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mainError && <FormMessage>{mainError}</FormMessage>}
        <Button disabled={loading} type="submit">Submit</Button>
      </form>
      <FullPageLoader loading={loading} />
    </Form>
  )
}
