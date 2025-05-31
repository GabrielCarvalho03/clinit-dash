import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { resetPasswordData } from "./schema";


export interface ResetPasswordProps {
    handleUploadPassword: (data :resetPasswordData,route: AppRouterInstance, id:string) => Promise<void>
    isLoading:boolean , 
    setIsLoading : (value :boolean) => void
}