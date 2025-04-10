"use client";

import { clientRequest } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuShortcut } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"  // Import Avatar for user profile
import { cn } from "@/lib/utils"

import Logout from "@/app/_component/Logout";
import { TaskObject, TaskStatus } from "@/lib/definitions";

interface GroupedTaskByDate {
  [id: string]: TaskObject[]
}

export default function MePage() {
  const [taskLoading, setTaskLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskObject[]>([]);
  const [tasksGrouped, setTasksGrouped] = useState<GroupedTaskByDate>({});
  const [sessions, setSessions] = useState([]);

  const [selectedTask, setSelectedTask] = useState<TaskObject | undefined>()
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const groupByDate = (tasks: TaskObject[]) => tasks.reduce((acc: GroupedTaskByDate, t: TaskObject) => {
    acc[t.createdAt] = acc[t.createdAt] || []
    acc[t.createdAt].push(t)
    return acc
  }, {})

  const handleManageSessions = () => {
    // Handle session management logic here
    alert("Managing sessions...")
  }

  const handleProfileView = () => {
    // Handle profile view logic here
    alert("Viewing profile...")
  }

  const handleLogoutDialog = (state: boolean) => {
    setOpenLogoutDialog(state);
  }

  const getTasks = async () => {
    setTaskLoading(true);
    const taskResult = await clientRequest.get('/api/tasks');
    if(taskResult.status == 200){
      setTasks(taskResult.data);
      console.log(tasks);
    }
    setTaskLoading(false);
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

  useEffect(()=>{
    getTasks();
    getSessions();
  }, [])

  useEffect(()=>{
    console.log(tasks);
    if(tasks.length > 0){
      setSelectedTask(tasks[0]);
      setTasksGrouped(groupByDate(tasks));
    }else{
      setTasksGrouped({});
    }
    console.log(sessions);
  }, [tasks, sessions])

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-12 border-b px-4 flex items-center justify-between sm:justify-start sm:gap-3">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="sm:hidden">
                ☰
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SheetHeader>
                <SheetTitle>Tasks</SheetTitle>
                <SheetDescription>
                  Manage your tasks here
                </SheetDescription>
              </SheetHeader>
              <Sidebar
                tasksGrouped={tasksGrouped}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
              />
            </SheetContent>
            <h1 className="font-semibold text-lg">Task Manager</h1>
          </Sheet>
        </div>

        {/* Avatar Button (Visible on all screen sizes, next to the title on small screens) */}
        
        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar>
                  <AvatarImage src="https://via.placeholder.com/40" alt="User Avatar" />
                </Avatar>
                <span className="hidden sm:block">user@email.com</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileView}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleManageSessions}>
                Manage Sessions
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={()=>{handleLogoutDialog}}>
                Signout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-1 overflow-hidden">
        <div className="hidden sm:flex sm:w-1/4 border-r">
          <Sidebar
            tasksGrouped={tasksGrouped}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        </div>

        <section className="flex-1 p-4 overflow-y-auto">
          {selectedTask ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-muted-foreground">{selectedTask.createdAt}</div>
                <Button variant="link" size="sm" className="text-red-500">
                  Delete Task
                </Button>
              </div>
              <h2
                className={cn("text-2xl font-bold mb-2", selectedTask.status == TaskStatus.COMPLETED && "text-muted-foreground line-through")}
              >
                {selectedTask.title}
              </h2>
              <p>{selectedTask.content}</p>
            </>
          ) : (
            <div className="text-muted-foreground">Select a task to view</div>
          )}
        </section>
      </main>
      <Logout open={openLogoutDialog} handleOpenDialog={handleLogoutDialog}/>
    </div>
  )
}

interface SideBarProps {
  tasksGrouped: GroupedTaskByDate,
  selectedTask: TaskObject | undefined,
  setSelectedTask: (task: TaskObject) => void
}

function Sidebar({ tasksGrouped, selectedTask, setSelectedTask }: SideBarProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4 border-b">
        <Button size="sm">Add</Button>
      </div>
      {Object.entries(tasksGrouped).map(([date, tasks]) => (
        <div key={date}>
          <div className="px-4 py-2 text-xs text-muted-foreground bg-muted border-t sticky top-0 z-10">{date}</div>
          {tasks.map((t:TaskObject) => (
            <div
              key={t.id}
              className={cn(
                "p-4 border-b cursor-pointer hover:bg-muted/50 flex justify-between items-start",
                selectedTask?.id === t.id && "bg-muted"
              )}
              onClick={() => setSelectedTask(t)}
            >
              <div className={cn(t.status === TaskStatus.COMPLETED  && "text-muted-foreground line-through")}> 
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-muted-foreground">{t.createdAt}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={t.status == TaskStatus.COMPLETED ? "default" : "outline"}>
                  {t.status == TaskStatus.COMPLETED ? "Done" : "Pending"}
                </Badge>
                <Button variant="link" size="sm" className="text-red-500 px-0">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </ScrollArea>
  )
}
