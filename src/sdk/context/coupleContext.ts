import React, { createContext } from "react";

type IUserContext = {
  coupleUser: {
    [key: string]: any;
  };
  setCoupleUser: (c: any) => void;
};

const CoupleUserContext = createContext<IUserContext>({
  coupleUser: {},
  setCoupleUser: () => {},
});
export default CoupleUserContext;
