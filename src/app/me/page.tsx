"use client";

import { clientRequest } from "@/lib/utils";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";

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

  const handleLogout = async ()=>{
    console.log('logout');
    const result = await clientRequest.post('/api/logout');
    const data = await result;
    if(data.status == 200){
      redirect('/login', RedirectType.push);
    }else{
      alert(JSON.stringify(data.data));
    }
  }

  return (
    <div>Home page <Link href={"/"} onClick={handleLogout}>Logout</Link></div>    
  )
}
