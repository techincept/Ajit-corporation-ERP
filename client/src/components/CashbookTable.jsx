import axios from "axios";
import { useState } from "react";
import { useParty } from "../context/Party";
import InputBox from "./InputBox";

function CashbookTable({ cashbook, setState }) {
  const { parties } = useParty();
  const [search, setSearch] = useState({
    date: "",
    party: "",
  });
  const [searchData, setSearchData] = useState([]);
  const token = JSON.parse(localStorage.getItem("i"));
  const config = {
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };
  const tablehead = [
    "Voucher Number",
    "Party",
    "Naration",
    "Credit",
    "Debit",
    "Running Balance",
  ];
  async function handleSearch() {
    const { data } = await axios.post(
      "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/cashbook/search",
      search,
      config
    );

    setSearchData(data);
  }

  return (
    <div className="grid h-fit w-2/3 px-5 ">
      <div className="flex h-fit items-center gap-10 ">
        <InputBox
          label="Date"
          className="w-52"
          type="date"
          onChange={(e) =>
            setSearch((prev) => ({ ...prev, date: e.target.value }))
          }
        />
        <div className="grid">
          <label htmlFor="payTo">Party</label>
          <select
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, party: e.target.value }))
            }
            className="mt-1 h-fit w-44 border border-gray-400 p-2"
            name="cashbook"
          >
            <option selected disabled value="">
              Select Party
            </option>
            {cashbook.map((elm, idx) => (
              <option key={idx} value={elm._id}>
                {elm.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="mt-6 h-fit rounded bg-[#95D800] p-2 text-white hover:bg-[#95D870] "
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <table className=" mt-8 w-full overflow-scroll border border-black text-center">
        <thead className="border-b border-b-black bg-violet-200">
          <tr className="">
            {tablehead.map((item, idx) => (
              <td key={idx} className="border-r border-r-black">
                {item}
              </td>
            ))}
          </tr>
        </thead>
        <tbody className="relative">
          {searchData.length ? (
            searchData.map((item, idx) => {
              return (
                <tr
                  className=" even:bg-gray-100"
                  // onClick={() => {
                  //   setState({
                  //     cashbook: item.cashbook._id,
                  //     party: item.party._id,
                  //     amount: item.amount,
                  //     narration: item.narration,
                  //     date: item.date,
                  //     id: item._id,
                  //   });
                  // }}
                  key={idx}
                >
                  <td className="">{item.voucherNumber}</td>
                  <td className="border-l border-l-black">{item.party.name}</td>
                  <td className="border-l border-l-black">{item.narration}</td>
                  <td className={`border-l border-l-black text-green-600`}>
                    {item.type == "credit" ? item.amount.toFixed(2) : 0}
                  </td>
                  <td className={`border-l border-l-black text-red-600`}>
                    {item.type != "credit" ? item.amount.toFixed(2) : 0}
                  </td>
                  <td className="border-l border-l-black">
                    {item.currentBalance >= 0 ? (
                      <span className="text-green-600">
                        {item.currentBalance.toFixed(2) + " CR"}
                      </span>
                    ) : (
                      <span className="text-red-600">
                        {(item.currentBalance * -1).toFixed(2) + " DR"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <span className="absolute left-0 right-0 block w-full bg-amber-100 text-center">
              no cashbook transactions found.
            </span>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CashbookTable;
