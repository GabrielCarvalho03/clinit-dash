import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { LoginSchemaData } from "./schema";

export interface useLoginProps {
  loadingLogin: boolean;
  setLoadingLogin: (loading: boolean) => void;
  onSubmit: (data: LoginSchemaData, router: AppRouterInstance) => Promise<void>;
}
