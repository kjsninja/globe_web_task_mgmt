"use client";

import { clientRequest } from "@/lib/utils";
import { useEffect, useState } from "react";
import Logout from "../_component/Logout";

export default function HomePage() {
  const [taskLoading, setTaskLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);

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
    console.log(sessions);
  }, [tasks, sessions])

  return (
    <div>Home page <Logout/></div>    
  )
}
