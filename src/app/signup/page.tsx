"use client";

import { UserSignUpSchema } from "@/lib/dto/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { redirect, RedirectType } from "next/navigation";
import { useState } from "react";
import { clientRequest } from "@/lib/utils";
import FullPageLoader from "../_component/Loader";
import Link from "next/link";


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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">Signup</CardTitle>
          <CardDescription className="flex items-center justify-center">First step to manage your task.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={  form.handleSubmit(onSubmit)} className="space-y-8">
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
              {mainError && <FormMessage>{mainError}</FormMessage>}
              <div className="space-y-3">
                <Button disabled={loading} className="w-full" type="submit">Submit</Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Back to login</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FullPageLoader loading={loading} />
    </div>
  )
}
