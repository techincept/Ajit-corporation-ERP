import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Party = createContext();

const PartyProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("i"));

  const location = useLocation();

  const config = {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };

  const initial = {
    name: "",
    city: "",
    openingBalance: 0,
    type: "credit",
  };

  const [parties, setParties] = useState([]);
  const [cashbook, setCashbook] = useState([]);
  const [allParties, setAllParties] = useState([]);
  const [party, setParty] = useState(initial);

  const fetchParties = async () => {
    try {
      const { data } = await axios.get(
        "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/party/",
        config
      );
      const party = data.filter((p) => {
        return !p.name.toLowerCase().includes("cashbook");
      });
      const cashbook = data.filter((p) => {
        return p.name.toLowerCase().includes("cashbook");
      });
      //
      data.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
      //
      setAllParties(data);
      setCashbook(cashbook);
      setParties(party);
    } catch (error) {
      console.error(error);
    }
  };
  const createParty = async () => {
    const { data } = await axios.post(
      "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/party/create",
      party,
      config
    );
    //
    setParty((prev) => ({
      ...initial,
      type: prev.type,
    }));
    setIsLoading(false);
  };
  const updateParty = async () => {
    const { data } = await axios.put(
      "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/party/",
      party,
      config
    );
    fetchParties();
    setParty(initial);
    setIsLoading(false);
  };

  // const location = useLocation();

  useEffect(() => {
    fetchParties();
  }, [party, location.pathname]);

  return (
    <Party.Provider
      value={{
        isLoading,
        setIsLoading,
        parties,
        setParties,
        cashbook,
        setCashbook,
        allParties,
        setAllParties,
        createParty,
        party,
        setParty,
        updateParty,
        fetchParties,
      }}
    >
      {children}
    </Party.Provider>
  );
};

export const useParty = () => useContext(Party);

export default PartyProvider;
