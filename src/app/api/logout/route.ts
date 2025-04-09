import { hasSession, removeSession } from "@/lib/session";
import { fromBackend } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const token = await hasSession();

  if(!token){
    return NextResponse.json({
      message: "Unauthorize"
    }, { status: 401 });
  }

  const botRequest = await fromBackend.post(`api/me/logout`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const returnData = await botRequest;
  if(returnData.status == 200 || returnData.status == 401){
    await removeSession();
    return NextResponse.json({}, { status: 200 });
  }
  return NextResponse.json({}, { status: returnData.status });
}