"use client";

import { useEffect, useState } from "react";

import { clientRequest } from "@/lib/utils";
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"  // Import Avatar for user profile
import { User } from "@/lib/definitions";

interface ProfileSettingProps {
  handleSignOut: () => void
  handleManageSessions: () => void
  handleProfileView: (user: User | undefined) => void
}

export default function ProfileSetting(props: ProfileSettingProps) {
  const [user, setUser] = useState<User>();

  const getUserInfo = async function(){
    const result = await clientRequest.get('/api/me');
    const resData = await result;
    if(resData.status == 200){
      setUser(resData.data);
    }
  }

  useEffect(()=>{
    getUserInfo();
  }, []);

  useEffect(()=>{
    
  }, [user]);

  return (<>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar>
            <AvatarImage src={`https://robohash.org/${user?.email}?set=set4&bgset=&size=40x40`} alt="User Avatar" />
          </Avatar>
          <span className="hidden sm:block">{user?.name}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={()=>{props.handleProfileView(user)}}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={()=>{props.handleManageSessions()}}>
          Manage Sessions
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={()=>{props.handleSignOut()}}>
          Signout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>);
}
