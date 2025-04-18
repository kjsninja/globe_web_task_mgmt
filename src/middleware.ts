"use server";

import { NextResponse, type NextRequest } from "next/server";
import { hasSession, verifyToken, removeSession } from "@/lib/session";
import { fromBackend, COOKIE_NAME } from "./lib/utils";

// 1. Specify protected and public routes
const protectedRoutes = ['/me', '/me/tasks']
const publicRoutes = ['/login', '/signup', '/']

const checkAuthentication = async () =>{
  let token = await hasSession()

  // check if token expiration is valid
  // before calling again another route
  if(token){
    if(!await verifyToken(token)){
      await removeSession();
      token = '';
    }else{
      // check now the db if session is not yet deleted
      const isValidToken = await fromBackend.post('/api/auth/validate', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if(isValidToken.status != 200){
        await removeSession();
        token = '';
      }
    }
  }

  return token;
}

export function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  let token = req.cookies.get(COOKIE_NAME)?.value;

  checkAuthentication().then(data=>{
    token = data;
  }).catch(()=>{})

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    token &&
    !req.nextUrl.pathname.startsWith('/me')
  ) {
    return NextResponse.redirect(new URL('/me', req.nextUrl))
  }
 
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  // matcher: ['/me', '/login', '/signup'],
};
