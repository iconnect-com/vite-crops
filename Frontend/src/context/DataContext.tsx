import { ReactNode, createContext } from "react";
import { axiosInstance } from "../axios-Instance";
import { useQuery } from "@tanstack/react-query";
import { ICommodity } from "../interface";

interface IDataContext {
  publicCommodities: ICommodity[];
}

export const DataContext = createContext<IDataContext>({
  publicCommodities: [],
});

export const DataContextContainer = ({ children }: { children: ReactNode }) => {
  const { data = [] } = useQuery<ICommodity[]>({
    queryFn: async () => {
      const res = await axiosInstance.get(`/commodity`);
      return res.data?.data;
    },
    queryKey: ["commodity"],
  });

  return (
    <DataContext.Provider value={{ publicCommodities: data }}>
      {children}
    </DataContext.Provider>
  );
};
