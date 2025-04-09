import { fromBackend } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const botRequest = await fromBackend.post(`api/signup`, body);
  const returnData = await botRequest;
  if(returnData.status === 201){
    return NextResponse.json({}, { status: returnData.status });
  }else{
    return NextResponse.json(returnData.data, { status: returnData.status });
  }
}