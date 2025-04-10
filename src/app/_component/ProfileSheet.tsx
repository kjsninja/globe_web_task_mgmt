import { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User } from "@/lib/definitions"
import { UserUpdateSchema } from "@/lib/dto/user"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { clientRequest } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

interface SheetProps {
  open: boolean,
  handleOpenSheet: (state: boolean) => void,
  userProfile: User
  onUpdate: (u: User) => void
}

export default function ProfileSheet(props: SheetProps) {
  const [loading, setLoading] = useState(false);
  const [mainError, setMainError] = useState('');

  useEffect(()=>{
    if(props.userProfile.name){
      form.setValue("name", props.userProfile.name);
    }
  }, [props.userProfile])

  const form = useForm<z.infer<typeof UserUpdateSchema>>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      name: props.userProfile.name
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserUpdateSchema>) {
    setMainError('');
    setLoading(true);
    const resp = await clientRequest.put('/api/me', values);
    const result = await resp;
    if(result.status == 200){
      setLoading(false);
      props.onUpdate({ ...props.userProfile, name: result.data.data.name })
      props.handleOpenSheet(false);
    }else{
      console.log(result);
      setMainError(result.data.error);
    }
    setLoading(false);
  }


  return <Sheet open={props.open} onOpenChange={
    (open: boolean)=>{
      props.handleOpenSheet(open)
    }
    }>
    <SheetContent className="w-full sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-1.5 p-4">
        <Form {...form}>
          {mainError && <FormMessage>{mainError}</FormMessage>}
          <form
            onSubmit={ form.handleSubmit(onSubmit) }
            className="grid gap-4 py-4"
          >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right col-span-1">Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="col-span-3" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right col-span-1">Email</FormLabel>
                    <FormControl>
                      <Input defaultValue={props.userProfile.email} disabled className="col-span-3" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right col-span-1">Email</div>
              <Input disabled defaultValue={props.userProfile.email} className="col-span-3" />
            </div> */}
            <SheetFooter>
              <Button disabled={loading} type="submit">Submit</Button>
            </SheetFooter>
          </form>
        </Form>
      </div>
    </SheetContent>
  </Sheet>
}