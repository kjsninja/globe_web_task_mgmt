"use client";

import { clientRequest } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SessionObject } from '@/lib/definitions'

export default function SessionPageId() {
  const params = useParams();
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessions, setSessions] = useState<SessionObject[]>();

  const getSessions = async () => {
    setSessionLoading(true);
    const sessionResult = await clientRequest.get(`/api/sessions`);
    if(sessionResult.status == 200){
      setSessions(sessionResult.data);
    }
    setSessionLoading(false);
  }

  useEffect(()=>{
    getSessions();
  }, [])

  useEffect(()=>{
    console.log(sessions);
  }, [sessions])

  return (
    <div>Session page {sessions?.length}</div>    
  )
}
