import { hasSession, removeSession } from "@/lib/session";
import { fromBackend } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await hasSession();

  if(!token){
    return NextResponse.json({
      message: "Unauthorize"
    }, { status: 401 });
  }

  const botRequest = await fromBackend.get(`api/me/tasks/${(await params).id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const returnData = await botRequest;
  console.log(returnData);
  return NextResponse.json(returnData.data, { status: returnData.status });
}