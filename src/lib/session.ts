import 'server-only'
import { cookies } from 'next/headers'
import { COOKIE_NAME, TOKEN_SECRET } from './utils';
import { jwtVerify } from 'jose';

export async function createSession(token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = token
  const cookieStore = await cookies()
  const resp = cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
  console.log(resp);
} 

export const hasSession = async () => {
  const cookie =  (await cookies()).get(COOKIE_NAME)?.value
  return cookie || '';
}

export const decodeToken = async (token: string)=>{
  return await (await jwtVerify(token, TOKEN_SECRET)).payload
}

export const verifyToken = async (token: string)=>{
  try{
    await jwtVerify(token, TOKEN_SECRET)
    return true;
  }catch(e){
    console.log(e);
    return false;
  }
}

export const removeSession = async () => {
  (await cookies()).delete(COOKIE_NAME)
}