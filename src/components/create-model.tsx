"use client"

import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogAction,


} from "./ui/alert-dialog"

import { authClient } from "@/lib/auth-client"

interface UpgradeModelProps { 
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UpgradeModel = ({
  open,
  onOpenChange,
}: UpgradeModelProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
         <AlertDialogHeader>
            <AlertDialogDescription>
                You need an active subscription to perform this action. Upgrade to Pro to unlock all features.
            </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
            onClick={() => authClient.checkout({slug : "pro"})}
            >
                Upgrade Now
            </AlertDialogAction>
         </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
