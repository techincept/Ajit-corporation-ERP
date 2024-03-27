import axios from "axios";
import { useState } from "react";
import CashbookTable from "../components/CashbookTable";
import Dashboard from "../components/Dashboard";
import InputBox from "../components/InputBox";
import { useParty } from "../context/Party";

function Cashbook() {
  const token = JSON.parse(localStorage.getItem("i"));
  const config = {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };

  const [state, setState] = useState({
    cashbook: "",
    party: "",
    amount: 0,
    type: "",
    narration: "",
    date: "",
    id: "",
  });

  // const [parties, setParties] = useState([]);
  const { parties, cashbook, setCashbook } = useParty();

  async function handleSubmit(e) {
    e.preventDefault();

    const { data } = await axios.post(
      "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/cashbook/",
      state,
      config
    );

    setState((prev) => ({
      cashbook: prev.cashbook,
      party: "",
      amount: 0,
      type: "",
      narration: "",
      date: prev.date,
    }));
  }

  return (
    <Dashboard>
      <div className="relative ">
        <p className="skew-y-4 bg-white p-6 text-xl">CASHBOOK</p>
        <div className="relative mx-auto my-5 flex w-[98%] bg-white p-10">
          <form
            // onSubmit={handleSubmit}
            action=""
            className="relative grid w-1/2 gap-7 border-r-2 border-blue-500 "
          >
            <div className="flex w-full flex-wrap gap-7">
              <div className="grid">
                <label htmlFor="payTo">Cashbook</label>
                <select
                  className="mt-1 h-fit w-44 border border-gray-400 p-2"
                  name="cashbook"
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, cashbook: e.target.value }))
                  }
                  value={state.cashbook}
                >
                  <option selected disabled value="">
                    Select Cashbook
                  </option>
                  {cashbook.map((elm, idx) => (
                    <option key={idx} value={elm._id}>
                      {elm.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid">
                <label htmlFor="payTo">Party</label>
                <select
                  className="mt-1 h-fit w-44 border border-gray-400 p-2"
                  name="cashbook"
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, party: e.target.value }))
                  }
                  value={state.party}
                >
                  <option selected disabled value="">
                    Select Party
                  </option>
                  {parties.map((elm, idx) => (
                    <option
                      // selected={elm._id == random}
                      key={idx}
                      value={elm._id}
                    >
                      {elm.name}
                    </option>
                  ))}
                </select>
              </div>
              <InputBox
                className="w-44"
                label="Amount"
                type="number"
                name="amount"
                value={state.amount}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
              <div className="grid">
                <label htmlFor="payTo">Transaction Type</label>
                <select
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, type: e.target.value }))
                  }
                  value={state.type}
                  className="mt-1 h-fit w-44 border border-gray-400 p-2"
                  name="cashbook"
                >
                  <option value=""> select transaction</option>
                  <option value="credit"> Credit</option>
                  <option value="debit"> Debit</option>
                </select>
              </div>
              <InputBox
                className="w-44"
                label="Naration"
                name="naration"
                value={state.narration}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, narration: e.target.value }))
                }
              />
              <InputBox
                className="w-44"
                label="Date"
                name="date"
                type="date"
                value={state.date}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
            <button
              type="button"
              className="h-fit w-fit rounded bg-green-500 px-3 py-1.5 text-white hover:bg-green-400"
              onClick={handleSubmit}
            >
              Save
            </button>
          </form>
          <CashbookTable
            setCashbook={setCashbook}
            cashbook={cashbook}
            setState={setState}
          />
        </div>
      </div>
    </Dashboard>
  );
}

export default Cashbook;
