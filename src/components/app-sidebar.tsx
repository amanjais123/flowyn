"use client" ;
import { 
    CreditCardIcon , 
    FolderOpenIcon , 
    HistoryIcon ,
    icons,
    KeyIcon ,
    LogOutIcon ,
    StarIcon
 } from 'lucide-react'; 
import Image from 'next/image';
 import Link from 'next/link';
import React from 'react'
import { usePathname , useRouter } from 'next/navigation';
import { 
    Sidebar ,
    SidebarContent,
    SidebarFooter ,
    SidebarGroup ,
    SidebarGroupContent ,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from './ui/sidebar';
import { authClient } from '@/lib/auth-client';
import { useHasActiveSubscription } from '@/features/subscriptions/hooks/use-subscription';
const menuItems = [
    {
        title : "Home" ,
        items : [
            {
                title : "Workflows",
                icon:FolderOpenIcon ,
                url : "/workflows" ,
            },
             {
                title : "Credentials",
                icon:KeyIcon ,
                url : "/credentials" ,
            },
             {
                title : "Executions",
                icon:HistoryIcon ,
                url : "/executions" ,
            }
           
            
        ]
    }
]


const AppSidebar = () => {
    const router = useRouter() ;
    const Pathname =usePathname() ;
    const {hasActiveSubscription ,isLoading } = useHasActiveSubscription() ;
  return (
   <Sidebar collapsible='icon'>
    <SidebarHeader>
        <SidebarMenuItem>
       <SidebarMenuButton
  asChild
  className="h-11 px-4 gap-3 rounded-md transition-colors hover:bg-muted/50"
>
  <Link href="/" prefetch className="flex items-center gap-2">
    <Image
      src="/floww.svg"
      alt="Flowyn"
      width={28}
      height={28}
      className="shrink-0"
      priority
    />

    <span className="text-3xl font-semibold tracking-tight leading-none">
      Flowyn
    </span>
  </Link>
</SidebarMenuButton>

        </SidebarMenuItem>
    </SidebarHeader>
    <SidebarContent>
        {menuItems.map((group) => (
            <SidebarGroup key={group.title}>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {group.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                            tooltip={item.title}
                            isActive={
                                item.url === "/" 
                                ? Pathname === "/"
                                : Pathname.startsWith(item.url)
                            } 
                            asChild
                            className='gap-x-4 h-10 px-4 '
                            >
                              <Link href={item.url} prefetch>
                              <item.icon className='size-4'/>
                              <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                                        </SidebarMenu>

                </SidebarGroupContent>
            </SidebarGroup>
        ))}
    </SidebarContent>
    <SidebarFooter>
        <SidebarMenu>
            {!hasActiveSubscription && !isLoading && (
    <SidebarMenuItem>
                <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className='gap-x-4 px-4 h-10'
                onClick={() => authClient.checkout({slug:"pro"})}
                >
                <StarIcon className='h-4 w-4'/>
                <span>Upgrade to Pro</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            ) }
            
            <SidebarMenuItem>
                <SidebarMenuButton
                tooltip="Billing Portal"
                className='gap-x-4 px-4 h-10'
                onClick={() => authClient.customer.portal()}
                >
                <CreditCardIcon className='h-4 w-4'/>
                <span>Billing Portal</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
                <SidebarMenuItem>
                <SidebarMenuButton
                tooltip="Logout"
                className='gap-x-4 px-4 h-10'
                onClick={() => authClient.signOut({
                    fetchOptions:{
                        onSuccess: () => {
                            router.push("/login") ;
                         },
                    }
                }) }
                >
                <LogOutIcon className='h-4 w-4'/>
                <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarFooter>


   </Sidebar>
  )
}

export default AppSidebar ;
