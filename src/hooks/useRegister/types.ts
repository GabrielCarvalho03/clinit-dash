import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { RegisterSchemaData } from "./schema";

export interface useRegisterProps {
  loadingRegister: boolean;
  setLoadingRegister: (loading: boolean) => void;
  onSubmit: (
    data: RegisterSchemaData,
    router: AppRouterInstance
  ) => Promise<void>;
}
