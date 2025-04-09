"use client";

import { UserSignUpSchema } from "@/lib/dto/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { redirect, RedirectType } from "next/navigation";
import { useState } from "react";
import { clientRequest } from "@/lib/utils";


export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [mainError, setMainError] = useState('');


  // 1. Define your form.
  const form = useForm<z.infer<typeof UserSignUpSchema>>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    },
  })
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserSignUpSchema>) {
    setMainError('');
    setLoading(true);
    const resp = await clientRequest.post('/api/signup', values);
    if(resp.status == 201){
      setLoading(false);
      redirect('/login', RedirectType.push);
    }else{
      if(resp.data.field){
        form.setError(resp.data.field, {
          message: resp.data.error
        })
      }else{
        setMainError("There is problem with your request.");
      }
    }
    setLoading(false);
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign-Up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={  form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your email..." {...field} />
                  </FormControl>
                  {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Type your password..." {...field} />
                  </FormControl>
                  {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your name here..." {...field} />
                  </FormControl>
                  {form.formState.errors.name && <FormMessage>{form.formState.errors.name.message}</FormMessage>}
                </FormItem>
              )}
            />
            {mainError && <FormMessage>{mainError}</FormMessage>}
            <Button disabled={loading} type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
      {/* <CardFooter className="flex w-full">
        <div>
        <Separator className="my-4" />
        <Button>Signup</Button>
        </div>
      </CardFooter> */}
    </Card>
  )
}
