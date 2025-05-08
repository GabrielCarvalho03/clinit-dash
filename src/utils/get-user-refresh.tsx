import jwt from "jsonwebtoken";
import cookies from "js-cookie";
import { api } from "@/lib/axios/axios";

export const getUserRefresh = async (setClinic: any, setIsLoading: any) => {
  const token = cookies.get("tokenClinitt");
  const decoded = token && jwt.decode(token);

  setIsLoading(true);

  const res = await api.post("/user/get-by-id", {
    //@ts-ignore
    id: decoded?.id,
  });

  setClinic({
    ...res.data,
    id: res.data.id,
    name: res.data.ClinicName,
  });

  setIsLoading(false);

  return res.data;
};
