import React, { createContext } from "react";

type ISystemSocketContext = {
  systemSocket: any;
  setSystemSocket: (c: any) => void;
};

const SystemSocketContext = createContext<ISystemSocketContext>({
  systemSocket: null,
  setSystemSocket: () => {},
});
export default SystemSocketContext;
