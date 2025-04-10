"use client";

import { clientRequest } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import { TaskEditPayload, TaskObject, TaskStatus, User } from "@/lib/definitions";
import Logout from "@/app/_component/Logout";

import ProfileSetting from "@/app/_component/ProfileSetting";
import ProfileSheet from "@/app/_component/ProfileSheet";
import SessionSheet from "@/app/_component/SessionSheet";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import AddTaskForm from "@/app/_component/AddTaskForm";
import EditableContent from "@/app/_component/EditableContent";
import { NewTaskSchema } from "@/lib/dto/task";

interface GroupedTaskByDate {
  [id: string]: TaskObject[]
}

export default function MePage() {
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openProfileSheet, setOpenProfileSheet] = useState(false);
  const [openSessionSheet, setOpenSessionSheet] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [userProfile, setUserProfile] = useState<User>();

  const [taskLoading, setTaskLoading] = useState(false);
  
  const [tasks, setTasks] = useState<TaskObject[]>([]);
  const [tasksGrouped, setTasksGrouped] = useState<GroupedTaskByDate>({});

  const [selectedTask, setSelectedTask] = useState<TaskObject | undefined>()

  const groupByDate = (tasks: TaskObject[]) => tasks.reduce((acc: GroupedTaskByDate, t: TaskObject) => {
    acc[t.updatedAt] = acc[t.updatedAt] || []
    acc[t.updatedAt].push(t)
    return acc
  }, {})

  const getTasks = async () => {
    setTaskLoading(true);
    const taskResult = await clientRequest.get('/api/tasks');
    if(taskResult.status == 200){
      setTasks(taskResult.data);
    }
    setTaskLoading(false);
  }

  const handleLogoutDialog = (state: boolean) => {
    setOpenLogoutDialog(state);
  }

  const handleProfileSheet = (state: boolean) => {
    setOpenProfileSheet(state);
  }

  const handleSessionSheet = (state: boolean) => {
    setOpenSessionSheet(state);
  }

  const handleDelete = async (task: TaskObject) => {
    const taskResult = await clientRequest.delete(`/api/tasks/${task.id}`);
    const deleteData = await taskResult;
    if(deleteData.status == 200){
      toast("Success!", {
        description: <>Successfully deleted the task <strong>{task.title}</strong>.</>,
        className: "text-black"
      });
      await getTasks();
    }else{
      toast("Uh oh! Something went wrong.", {
        description: <>There is problem with your request..</>,
        className: "text-black"
      });
    }
  }

  const handleAdd = () => {
    setOpenTaskDialog(true);
  }

  const updateTaskStatus = async(t: TaskObject, isComplete: boolean) => {
    const taskResult = await clientRequest.put(`/api/tasks/${t.id}`, {
      status: isComplete ? TaskStatus.COMPLETED : TaskStatus.PENDING
    });
    const updateData = await taskResult;
    if(updateData.status == 200){
      setTasks(tasks.map(e=>{
        if(e.id === t.id){
          e.status = isComplete ? TaskStatus.COMPLETED : TaskStatus.PENDING;
          e.updatedAt = new Date().toISOString()
        }
        return e;
      }).sort((a:TaskObject, b:TaskObject)=>{
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }))
      if(isComplete){
        toast("Completed Task!", {
          description: <>Congratulation on completing the task <strong>{t.title}</strong>.</>,
          className: "text-black"
        });
      }else{
        toast("Pending Task!", {
          description: <>You can work on the task <strong>{t.title}</strong> later.</>,
          className: "text-black"
        });
      }
    }else{
      toast("Uh oh! Something went wrong.", {
        description: <>There is problem with your request..</>,
        className: "text-black"
      });
    }
  }

  const handleEditTask = async (t: TaskObject, payload: TaskEditPayload) => {    
    const validateResult = NewTaskSchema.safeParse(payload)
    if(!validateResult){
      setTasks(tasks);
    }else{
      const taskResult = await clientRequest.put(`/api/tasks/${t.id}`, {
        title: payload.title,
        content: payload.content,
        status: t.status
      });
      const updateData = await taskResult;
      if(updateData.status == 200){
        setTasks(tasks.map(e=>{
          if(e.id === t.id){
            e.title = payload.title;
            e.content = payload.content;
            e.updatedAt = new Date().toISOString()
          }
          return e;
        }).sort((a:TaskObject, b:TaskObject)=>{
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        }))
        toast("Success!", {
          description: <>Successfully updated the task <strong>{t.title}</strong>.</>,
          className: "text-black"
        });
      }else{
        toast("Uh oh! Something went wrong.", {
          description: <>There is problem with your request..</>,
          className: "text-black"
        });
      }
    }
  }

  const onTaskAdd = async (state: boolean) => {
    console.log("triggered");
    await getTasks()
    setOpenTaskDialog(state);
  }

  useEffect(()=>{
    getTasks();
  }, [])

  useEffect(()=>{
    console.log(tasks);
    if(tasks.length > 0){
      setSelectedTask(tasks[0]);
      setTasksGrouped(groupByDate(tasks));
    }else{
      setSelectedTask(undefined);
      setTasksGrouped(groupByDate([]));
    }
  }, [tasks])

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
                handleAdd={handleAdd}
                handleDelete={(task: TaskObject)=>{handleDelete(task)}}
              />
            </SheetContent>
            <h1 className="font-semibold text-lg">Task Manager</h1>
          </Sheet>
          <SessionSheet open={openSessionSheet} handleOpenSheet={handleSessionSheet} />
          <ProfileSheet user={userProfile} open={openProfileSheet} handleOpenSheet={handleProfileSheet} />
        </div>

        {/* Avatar Button (Visible on all screen sizes, next to the title on small screens) */}
        
        <div className="flex items-center gap-2 ml-auto">
          <ProfileSetting handleSignOut={()=>{handleLogoutDialog(true)}} handleManageSessions={()=>{handleSessionSheet(true)}} 
            handleProfileView={(user: User | undefined)=>{
              setUserProfile(user);
              handleProfileSheet(true)
            }} 
          />
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-1 overflow-hidden">
        <div className="hidden sm:flex sm:w-1/4 border-r">
          <Sidebar
            tasksGrouped={tasksGrouped}
            selectedTask={selectedTask}
            handleAdd={handleAdd}
            setSelectedTask={setSelectedTask}
            handleDelete={(task: TaskObject)=>{handleDelete(task)}}
          />
        </div>

        <section className="flex-1 p-4 overflow-y-auto">
          {selectedTask ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-muted-foreground flex-1 flex justify-center">
                  {selectedTask.updatedAt}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={selectedTask.status === TaskStatus.COMPLETED ? true : false} onCheckedChange={(checked)=>{updateTaskStatus(selectedTask, checked)}} />
                  <Label htmlFor="airplane-mode">Mark As Complete</Label>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-red-500"
                  onClick={() => handleDelete(selectedTask)}
                >
                  Delete Task
                </Button>
              </div>

              <div>
                <EditableContent handleSave={(t: TaskObject, payload: TaskEditPayload) => { handleEditTask(t, payload); }} selectedTask={selectedTask} key={selectedTask.id} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-10 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v12a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium">No task selected</p>
                <p className="text-xs text-muted-foreground">Please select or add a task to get started.</p>
              </div>
              <Button size="sm" onClick={() => {handleAdd()}}>
                + Add Task
              </Button>
            </div>
          )}
        </section>
      </main>
      <Logout open={openLogoutDialog} handleOpenDialog={handleLogoutDialog}/>
      <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add new task</DialogTitle>
            <AddTaskForm onSuccess={onTaskAdd}/>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface SideBarProps {
  tasksGrouped: GroupedTaskByDate,
  selectedTask: TaskObject | undefined,
  setSelectedTask: (task: TaskObject) => void,
  handleDelete: (task: TaskObject) => void
  handleAdd: ()=> void
}

function Sidebar({ tasksGrouped, selectedTask, setSelectedTask, handleDelete, handleAdd }: SideBarProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4 border-b">
        <Button size="sm" onClick={()=>{handleAdd()}}>Add</Button>
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
                <div className="text-xs text-muted-foreground">{t.updatedAt}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={t.status == TaskStatus.COMPLETED ? "default" : "outline"}>
                  {t.status == TaskStatus.COMPLETED ? "Done" : "Pending"}
                </Badge>
                <Button variant="link" size="sm" className="text-red-500 px-0" onClick={()=>{handleDelete(t)}}>
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
