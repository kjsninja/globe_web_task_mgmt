import { hasSession, removeSession } from "@/lib/session";
import { fromBackend } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = await hasSession();

  if(!token){
    return NextResponse.json({
      message: "Unauthorize"
    }, { status: 401 });
  }

  const botRequest = await fromBackend.get(`api/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const returnData = await botRequest;
  return NextResponse.json(returnData.data, { status: returnData.status });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const token = await hasSession();

  if(!token){
    return NextResponse.json({
      message: "Unauthorize"
    }, { status: 401 });
  }

  const botRequest = await fromBackend.put(`api/me`, body, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const returnData = await botRequest;
  return NextResponse.json(returnData.data, { status: returnData.status });
}

export async function DELETE(request: Request) {
  const token = await hasSession();

  if(!token){
    return NextResponse.json({
      message: "Unauthorize"
    }, { status: 401 });
  }

  const botRequest = await fromBackend.delete(`api/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const returnData = await botRequest;
  return NextResponse.json(returnData.data, { status: returnData.status });
}