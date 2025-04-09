"use client";

import { clientRequest } from "@/lib/utils";
import { useEffect, useState } from "react";
import { redirect, RedirectType, useParams } from "next/navigation";
import Logout from "@/app/_component/Logout";
import { TaskObject } from "@/lib/definitions";

export default function TaskPageId() {
  const params = useParams();
  const [taskLoading, setTaskLoading] = useState(false);
  const [task, setTask] = useState<TaskObject>();

  const getTask = async () => {
    setTaskLoading(true);
    const sessionResult = await clientRequest.get(`/api/tasks/${params.id}`);
    if(sessionResult.status == 200){
      setTask(sessionResult.data);
      console.log(task);
    }else{
      redirect('/me/tasks', RedirectType.replace);
    }
    setTaskLoading(false);
  }

  useEffect(()=>{
    getTask();
  }, [])

  useEffect(()=>{
    console.log(task);
  }, [task])

  return (
    <div>Task page by id {task?.id} {task?.status} <Logout/></div>    
  )
}
