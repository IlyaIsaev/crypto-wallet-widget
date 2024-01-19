import { StoreProvider } from "./context";
import { PlaceOrderForm } from "./PlaceOrderForm";

export const PlaceOrder = () => (
  <StoreProvider>
    <PlaceOrderForm />
  </StoreProvider>
);
