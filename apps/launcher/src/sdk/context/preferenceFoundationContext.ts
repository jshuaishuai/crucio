import React, { createContext } from "react";

type IPreferenceFoundationContext = {
  preferenceFoundation: {
    [key: string]: any;
  };
  setPreferenceFoundation: (c: any) => void;
};

const PreferenceFoundationContext = createContext<IPreferenceFoundationContext>({
  preferenceFoundation: {},
  setPreferenceFoundation: () => {},
});
export default PreferenceFoundationContext;
