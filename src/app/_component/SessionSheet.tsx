
import { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { clientRequest } from "@/lib/utils";
import { SessionObject } from "@/lib/definitions"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner";

interface SheetProps {
  open: boolean,
  handleOpenSheet: (state: boolean) => void
}

interface GroupedSessionByDate {
  [id: string]: SessionObject[]
}

export default function SessionSheet(props: SheetProps) {
  const [sessions, setSessions] = useState<SessionObject[]>([]);
  const [sessionsGrouped, setSessionsGrouped] = useState<GroupedSessionByDate>({});
  const [sessionLoading, setSessionLoading] = useState(false);

  const handleDelete = async (id: string) => {
    const sessionResult = await clientRequest.post('/api/sessions', {
      id
    });
    const deleteData = await sessionResult;
    if(deleteData.status == 200){
      toast("Successfully deleted a session.");
      await getSessions();
    }else{
      toast("There is problem with your request.");
    }
  }

  const getSessions = async () => {
    setSessionLoading(true);
    const sessionResult = await clientRequest.get('/api/sessions');
    if(sessionResult.status == 200){
      setSessions(sessionResult.data);
      console.log(sessions);
    }
    setSessionLoading(false);
  }

  const groupByDate = (tasks: SessionObject[]) => tasks.reduce((acc: GroupedSessionByDate, t: SessionObject) => {
      acc[t.createdAt] = acc[t.createdAt] || []
      acc[t.createdAt].push(t)
      return acc
    }, {})

  useEffect(()=>{
    getSessions();
  }, [])

  useEffect(()=>{
    console.log(sessions);
    if(sessions.length > 0){
      setSessionsGrouped(groupByDate(sessions));
    }
  }, [sessions])

  return (
    <>
      <Sheet open={props.open} onOpenChange={(open: boolean)=>{
        props.handleOpenSheet(open)}}>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Active Sessions</SheetTitle>
            <SheetDescription>Manage your sessions
              <Badge variant="outline" className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 block w-full break-words whitespace-normal">
                ⚠ Warning: Deleting your session might log you out.
              </Badge>
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-full w-full">
            {Object.entries(sessionsGrouped).map(([date, tasks]) => (
              <div key={date}>
                <div className="px-4 py-2 text-xs text-muted-foreground border-t sticky top-0 z-10">{date}</div>
                {tasks.map((t:SessionObject) => (
                  <div key={t.id} className="p-4 border-b cursor-pointer hover:bg-muted/50 flex justify-between items-start">
                    <div className="font-medium"> 
                      <div className="font-medium">{t.metadata.agent}</div>
                      <div className="text-xs text-muted-foreground">{t.createdAt}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Button variant="link" size="sm" className="text-red-500 px-0" onClick={()=>{handleDelete(t.id)}}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}