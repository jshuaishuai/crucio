import React, { createContext } from "react";

type IUserContext = {
  user: {
    [key: string]: any;
  };
  setUser: (c: any) => void;
};

const UserContext = createContext<IUserContext>({
  user: {},
  setUser: () => {},
});
export default UserContext;
