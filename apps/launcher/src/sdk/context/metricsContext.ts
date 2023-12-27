import React, { createContext } from "react";

type IPreferenceContext = {
  metrics: {
    [key: string]: any;
  };
  setMetrics: (c: any) => void;
};

const MetricsContext = createContext<IPreferenceContext>({
  metrics: {},
  setMetrics: () => {},
});
export default MetricsContext;
