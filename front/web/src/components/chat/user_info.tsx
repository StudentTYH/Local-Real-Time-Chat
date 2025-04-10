"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  ReactNode
} from "react";


// 定义上下文类型
const USER_ID1 = createContext<{
  data: string;
  setUserid: (newData: string) => void;
} | undefined>(undefined);  // 默认值设为 undefined

// 提供上下文的组件
export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<string>("0");  // 初始化 data 为 "0"



  // 需要定义修改数据的钩子
  const setUserid = (newData: string) => {
    setData(newData);  // 更新 data 的函数
  };


  // 导出方式
  return (
    <USER_ID1.Provider value={{ data, setUserid }}>
      {children}
    </USER_ID1.Provider>
  );
};

// 自定义 Hook，方便其他组件访问上下文
export const useUserIn = () => {
  const context = useContext(USER_ID1);

  if (context === undefined) {
    throw new Error("useUserIn must be used within a UserInfoProvider");
  }

  return context;
};
