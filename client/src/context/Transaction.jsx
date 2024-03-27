import { createContext, useContext, useState } from "react";

const Transaction = createContext();

const TransactionProvider = ({ children }) => {
  const [transactionTransporter, setTransactionTransporter] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <Transaction.Provider
      value={{
        transactionTransporter,
        setTransactionTransporter,
        isEditMode,
        setIsEditMode,
      }}
    >
      {children}
    </Transaction.Provider>
  );
};

export const useTransaction = () => useContext(Transaction);

export default TransactionProvider;
