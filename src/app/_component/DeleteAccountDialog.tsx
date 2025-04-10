'use client'

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { clientRequest } from "@/lib/utils"
import { redirect, RedirectType } from "next/navigation"
import { toast } from "sonner"

interface DeleteDialogProps {
  open: boolean
  setOpen: (state: boolean) => void
}

export function DeleteAccountDialog(props: DeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const resp = await clientRequest.delete('/api/me');
    const respData = await resp;
    console.log(respData);
    if(respData.status == 200){
      redirect('/login', RedirectType.push);
    }else{
      toast.error("Uh. Oh! Failed!", {
        description: <div className="text-black">There is problem with the request.</div>
      });
    }
    setIsLoading(false);
  }

  return (
    <>
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent className="[&>button]:hidden" onInteractOutside={(e) => {
          e.preventDefault();
        }}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={isLoading} variant="outline" onClick={() => props.setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} variant="destructive" onClick={() => { handleDelete() }}>
            {!isLoading ? <>Confirm Delete</> : <>Deleting...</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
