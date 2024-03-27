/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import calculateAddTransaction from "../utils/calculateAddTransaction.js";
import { useParty } from "./Party";
import { useTransaction } from "./Transaction.jsx";

const initialTransaction = {
  date: "",
  paidTo: "",
  amount: "",
  receiverCommission: "",
  receiverCommissionPercentage: "",
  netPaidAmount: "",
  comisionTypeP: "Debit",
  receiverName: "",
  receiverNumber: "",
  biltyNumber: "",
  senderCommission: "",
  senderCommissionPercentage: "",
  netReceivedAmount: "",
  comisionTypeS: "Credit",
  receivedBy: "0",
  sender: "",
  senderNumber: "0",
  city: "",
  netComision: "",
  receiverCommissionEditable: false,
  senderCommissionEditable: false,
};
export const searchDataContext = createContext();

function SearchDataContextProvider({ children }) {
  const token = JSON.parse(localStorage.getItem("i"));
  const config = {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };
  const {
    transactionTransporter,
    setTransactionTransporter,
    isEditMode,
    setIsEditMode,
  } = useTransaction();
  const { parties, fetchParties } = useParty();
  const [transactionDetails, setTransactionDetails] =
    useState(initialTransaction);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState({
    to: "",
    date: "",
    from: "",
    party: "",
  });

  const [seachData, setSearchData] = useState({
    transaction: [],
    cashbook: [],
  });

  const [isFormFilled, setIsFormFilled] = useState(false);

  useEffect(() => {
    calculateAddTransaction(transactionDetails, setTransactionDetails);
  }, [
    transactionDetails.amount,
    transactionDetails.comisionTypeP,
    transactionDetails.comisionTypeS,
    transactionDetails.receiverCommission,
    transactionDetails.receiverCommissionPercentage,
    transactionDetails.senderCommission,
    transactionDetails.senderCommissionPercentage,
  ]);

  useEffect(() => {
    let currentDate = new Date();
    currentDate = currentDate.toISOString().split("T")[0];
    setTransactionDetails((pre) => ({ ...pre, date: currentDate }));
    setSearch((Pre) => ({
      ...Pre,
      from: currentDate,
      to: currentDate,
    }));
  }, [setSearch]);

  useEffect(() => {
    if (isFormFilled)
      setTransactionDetails({
        ...transactionTransporter,
        paidTo: transactionTransporter?.paidTo._id,
        sender: transactionTransporter?.sender._id,
      });
  }, [transactionTransporter]);

  const [allSearchData, setAllSearchData] = useState([]);
  const [selectedParties, setSelectedParties] = useState([]);
  const [hideForm, setHideForm] = useState(true);

  async function fetchAllTransactions() {
    const dataArray = [];

    const { data } = await axios.get(
      `https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/transaction/daily-transaction?to=${search.to}&from=${search.from}`,
      config
    );

    dataArray.push({
      search: {
        to: search.to,
        date: search.to,
        from: search.from,
        party: data[0].paidTo._id,
        name: data[0].paidTo.name,
      },
      seachData: { cashbook: [], transaction: [data[0]] },
    });

    for (let i = 0; i < data.length; i++) {
      const object = data[i];
      const lastObject = dataArray.find(
        (obj) => obj.search.name == object.paidTo.name
      );

      if (lastObject) {
        lastObject.seachData.transaction.push(object);
      } else {
        dataArray.push({
          search: {
            to: search.to,
            date: search.to,
            from: search.from,
            party: data[i].paidTo._id,
            name: data[i].paidTo.name,
          },
          seachData: { cashbook: [], transaction: [data[i]] },
        });
      }
    }

    setAllSearchData(dataArray);
    setIsLoading(false);
  }

  const fetchSearch = async () => {
    const newArr = [];

    for (let i = 0; i < selectedParties.length; i++) {
      const id = selectedParties[i];
      const { data } = await axios.post(
        "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/transaction/search",
        {
          to: search.to,
          date: search.to,
          from: search.from,
          party: id,
        },
        config
      );

      newArr.push({
        search: {
          to: search.to,
          date: search.to,
          from: search.from,
          party: id,
          name: parties.find((item) => item._id === id).name,
        },
        seachData: data,
      });
    }

    setAllSearchData(newArr);
  };

  return (
    <searchDataContext.Provider
      value={{
        fetchSearch,
        hideForm,
        setHideForm,
        selectedParties,
        setSelectedParties,
        allSearchData,
        setAllSearchData,
        isEditMode,
        transactionDetails,
        config,
        fetchParties,
        setTransactionDetails,
        initialTransaction,
        transactionTransporter,
        setIsEditMode,
        search,
        setSearchData,
        setSearch,
        seachData,
        parties,
        setTransactionTransporter,
        setIsFormFilled,
        isFormFilled,
        setIsLoading,
        isLoading,
        fetchAllTransactions,
      }}
    >
      {children}
    </searchDataContext.Provider>
  );
}
export default SearchDataContextProvider;
