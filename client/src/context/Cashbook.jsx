import { createContext, useContext } from "react";

const Cashbook = createContext();

const CashbookProvider = ({ children }) => {
  return <Cashbook.Provider>{children}</Cashbook.Provider>;
};

export const useCashbook = () => useContext(Cashbook);

export default CashbookProvider;
