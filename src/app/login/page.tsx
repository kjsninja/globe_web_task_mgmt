"use client";

import { UserLoginSchema } from "@/lib/dto/login"
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

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [mainError, setMainError] = useState('');

  // 1. Define your form.
  const form = useForm<z.infer<typeof UserLoginSchema>>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserLoginSchema>) {
    setMainError('');
    setLoading(true);
    const resp = await clientRequest.post('/api/login', values);
    const result = await resp;
    if(result.status == 200){
      setLoading(false);
      redirect('/me', RedirectType.push);
    }else{
      setMainError(result.data.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">Task Management</CardTitle>
          <CardDescription className="flex items-center justify-center">Creating tasks made easy.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Type your email..." {...field} />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              {mainError && <FormMessage>{mainError}</FormMessage>}
              {/* <Button disabled={loading} type="submit">Submit</Button> */}
              <div className="space-y-3">
                <Button disabled={loading} type="submit" className="w-full">
                  Submit
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/signup">Signup</Link>
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
