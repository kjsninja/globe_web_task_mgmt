"use client";

import Logout from "@/app/_component/Logout";
import { TaskObject } from "@/lib/definitions";
import { clientRequest } from "@/lib/utils";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [taskLoading, setTaskLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskObject[]>();

  const getTasks = async () => {
    setTaskLoading(true);
    const taskResult = await clientRequest.get('/api/tasks');
    if(taskResult.status == 200){
      setTasks(taskResult.data);
      console.log(tasks);
    }
    setTaskLoading(false);
  }

  useEffect(()=>{
    getTasks();
  }, [])

  useEffect(()=>{
    console.log(tasks);
  }, [tasks])

  return (
    <div>Tasks page {tasks?.length} <Logout></Logout></div>    
  )
}
