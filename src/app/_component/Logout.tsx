"use client";

import { redirect, RedirectType } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { clientRequest } from "@/lib/utils";

import { toast } from "sonner";

export default function Logout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async ()=>{
    console.log('logout');
    const result = await clientRequest.post('/api/logout');
    const data = await result;
    if(data.status == 200){
      redirect('/login', RedirectType.push);
    }else{
      toast("There is problem with the request.")
    }
    setIsLoggingOut(false);
  }
  

  return (
    <AlertDialog>
      <AlertDialogTrigger className="hover:bg-gray-100 hover:cursor-pointer rounded-sm px-2 py-1.5 text-sm text-start outline-hidden w-full">
        Signout
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will sign you out of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Signing Out..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
