import { createContext, ReactNode, useContext } from "react";

import { PlaceOrderStore } from "./store/PlaceOrderStore";

const store = new PlaceOrderStore();
const storeContext = createContext(store);

const useStore = () => {
  return useContext(storeContext);
};

interface Props {
  children: ReactNode;
}

const StoreProvider = ({ children }: Props) => (
  <storeContext.Provider value={store}>{children}</storeContext.Provider>
);

export { useStore, StoreProvider };
