import React, { createContext } from "react";

type IPreferenceContext = {
  preference: {
    [key: string]: any;
  };
  setPreference: (c: any) => void;
};

const PreferenceContext = createContext<IPreferenceContext>({
  preference: {},
  setPreference: () => {},
});
export default PreferenceContext;
