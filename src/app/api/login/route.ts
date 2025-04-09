import { createSession } from "@/lib/session";
import { fromBackend } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const botRequest = await fromBackend.post(`api/auth`, body);
  const returnData = await botRequest;
  if(returnData.status == 200){
    await createSession(returnData.data.token);
  }
  return NextResponse.json(returnData.data, { status: returnData.status });
}