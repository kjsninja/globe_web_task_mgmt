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

interface LogoutProps {
  open: boolean,
  handleOpenDialog: (state: boolean) => void
}

export default function Logout(props: LogoutProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async ()=>{
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
    <AlertDialog open={props.open} onOpenChange={(open: boolean)=>{
      props.handleOpenDialog(open)
    }}>
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
