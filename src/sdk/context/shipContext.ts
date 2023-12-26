import React, { createContext } from "react";

type IShipContext = {
  meShip: 0 | 1 | 2;
  taShip: 0 | 1 | 2;
  setMeShip: (c: any) => void;
  setTaShip: (c: any) => void;
};

const ShipContext = createContext<IShipContext>({
  meShip: 0,
  taShip: 0,
  setMeShip: () => {},
  setTaShip: () => {},
});
export default ShipContext;
