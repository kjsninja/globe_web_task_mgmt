"use client";

import { clientRequest } from "@/lib/utils";
import { useEffect, useState } from "react";
import { redirect, RedirectType, useParams } from "next/navigation";
import Logout from "@/app/_component/Logout";
import { SessionObject } from '@/lib/definitions'

export default function SessionPageId() {
  const params = useParams();
  const [sessionLoading, setSessionLoading] = useState(false);
  const [session, setSession] = useState<SessionObject>();

  const getSessions = async () => {
    setSessionLoading(true);
    const sessionResult = await clientRequest.get(`/api/sessions/${params.id}`);
    if(sessionResult.status == 200){
      setSession(sessionResult.data);
      console.log(session);
    }else{
      redirect('/me/sessions', RedirectType.replace);
    }
    setSessionLoading(false);
  }

  useEffect(()=>{
    getSessions();
  }, [])

  useEffect(()=>{
    console.log(session);
  }, [session])

  return (
    <div>Session page {session?.id} {session?.metadata.agent} {session?.createdAt} <Logout/></div>    
  )
}
