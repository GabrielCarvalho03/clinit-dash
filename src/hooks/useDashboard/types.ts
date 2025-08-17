import { Clinic } from "@/@types/auth";

export interface useDashboardProps {
  handleAccessDayChange: (clinit: Clinic) => Promise<void>;
}
