import { Select } from "antd";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DailyTransactionTable from "../components/DailyTransactionTable";
import Dashboard from "../components/Dashboard";
import InputBox from "../components/InputBox";
import { useParty } from "../context/Party";

function DailyTransaction() {
  const token = JSON.parse(localStorage.getItem("i"));
  const [searchValue, setSearchValue] = useState({
    to: "",
    from: "",
    party: "",
  });

  const { allParties } = useParty();

  useEffect(() => {
    let currentDate = new Date();
    currentDate = currentDate.toISOString().split("T")[0];
    setSearchValue((prev) => ({
      ...prev,
      from: currentDate,
      to: currentDate,
    }));
  }, []);

  const { parties } = useParty();

  const config = useMemo(
    () => ({
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const [transactions, setTransactions] = useState([]);

  const feachDailyTransaction = useCallback(async () => {
    const { data } = await axios.get(
      "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/transaction/daily",
      config
    );
    //
    setTransactions(data);
  }, [config]);

  const searchDailyTransaction = async () => {
    const { data } = await axios.get(
      `https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/transaction/daily-transaction?to=${searchValue.to}&party=${searchValue.party}&from=${searchValue.from}`,
      config
    );
    //
    setTransactions(data);
  };

  useEffect(() => {
    const getTransaction = async () => {
      const { data } = await axios.get(
        `https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/transaction/daily-transaction?to=${searchValue.to}&party=${searchValue.party}&from=${searchValue.from}`,
        config
      );
      //
      setTransactions(data);
    };
    getTransaction();
  }, [config, searchValue]);

  useEffect(() => {
    feachDailyTransaction();
  }, [feachDailyTransaction]);

  const handleDateUnitChange = (increment) => {
    let currentFromDate = new Date(searchValue.from);
    let currentToDate = new Date(searchValue.to);

    currentFromDate.setDate(currentFromDate.getDate() + increment);
    currentToDate.setDate(currentToDate.getDate() + increment);

    currentFromDate = currentFromDate.toISOString().split("T")[0];
    currentToDate = currentToDate.toISOString().split("T")[0];

    setSearchValue((pre) => ({
      ...pre,
      from: currentFromDate,
      to: currentToDate,
    }));
  };

  const horizontalRef = useRef(null);

  const verticalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const horizontalScroll = horizontalRef.current.scrollLeft;
      const verticalScroll = verticalRef.current.scrollTop;

      if (key === "ArrowDown") {
        verticalRef.current.scrollTo({
          top: verticalScroll + 40,
          behavior: "instant",
        });
      }
      if (key === "ArrowUp") {
        verticalRef.current.scrollTo({
          top: verticalScroll - 40,
          behavior: "instant",
        });
      }
      if (key === "ArrowLeft") {
        horizontalRef.current.scrollTo({
          left: horizontalScroll - 40,
          behavior: "instant",
        });
      }
      if (key === "ArrowRight") {
        horizontalRef.current.scrollTo({
          left: horizontalScroll + 40,
          behavior: "instant",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <Dashboard>
      <div className="relative h-full">
        <div className="mx-auto flex h-[calc(100vh-6rem)] flex-col gap-2 rounded  bg-white p-2">
          <div className="flex h-10 w-full justify-between">
            <div className="flex items-center ml-auto gap-2 mr-4">
              <button
                className="bg-blue-500 rounded flex items-center justify-center text-white text-2xl p-1"
                onClick={() => handleDateUnitChange(-1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z"
                  ></path>
                </svg>
              </button>
              Date From:
              <InputBox
                className="w-36"
                onChange={(e) => {
                  setSearchValue((Pre) => ({ ...Pre, from: e.target.value }));
                }}
                value={searchValue.from}
                type="date"
              />
              Date To:
              <InputBox
                className="w-36"
                value={searchValue.to}
                onChange={(e) => {
                  setSearchValue((Pre) => ({ ...Pre, to: e.target.value }));
                }}
                type="date"
              />
              <button
                className="bg-blue-500 rounded flex items-center justify-center text-white text-2xl p-1"
                onClick={() => handleDateUnitChange(1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="payTo">Party</label>

              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Select a party"
                onChange={(e) => {
                  setSearchValue((pre) => ({ ...pre, party: e }));
                }}
                onSearch={console.log}
                // filterOption={filterOption}
                options={allParties?.map((item) => ({
                  label: item.name,
                  value: item._id,
                }))}
                style={{
                  border: "1px solid #555",
                  borderRadius: "2px",
                  height: "100%",
                  width: "18rem",
                }}
              />
              <button
                onClick={searchDailyTransaction}
                className="rounded-md bg-green-400 text-white font-medium px-6 py-2"
              >
                Search
              </button>
            </div>
          </div>
          <div
            className="h-full flex flex-col items-start content-start w-full bg-white font-medium relative overflow-x-auto overflow-y-hidden"
            ref={horizontalRef}
          >
            <DailyTransactionTable />
            <div
              className="border max-h-full border-t-0 w-max border-black grid overflow-y-auto"
              ref={verticalRef}
            >
              <div className="block h-[6.3rem]"></div>
              {transactions.map((transaction, idx) => (
                <label
                  htmlFor={transaction._id}
                  key={transaction._id}
                  className="grid grid-cols-[80px_120px_100px_150px_150px_80px_100px_150px_150px_150px_80px_100px_150px_150px_100px_150px_150px_150px_150px_150px_150px] border-b justify-between w-full border-b-black text-center last:border-b-0"
                >
                  <div className="border-r border-r-black peer-checked:bg-gray-200 relative">
                    <input
                      className="absolute left-2 top-1 peer"
                      type="checkbox"
                      name={transaction._id}
                      id={transaction._id}
                    />
                    {idx + 1}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.date
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-")}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.voucherNumber}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.paidTo?.name}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.amount.toFixed(2)}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.receiverCommissionPercentage.toFixed(2)}%
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.receiverCommission.toFixed(2)}
                  </div>

                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.netPaidAmount.toFixed(2)}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.sender.name}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.amount.toFixed(2)}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.comissionTypeP === "Debit"
                      ? transaction.senderCommissionPercentage.toFixed(2)
                      : (transaction.senderCommissionPercentage * -1).toFixed(
                          2
                        )}
                    %
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.comissionTypeP === "Debit"
                      ? transaction.senderCommission.toFixed(2)
                      : (transaction.senderCommission * -1).toFixed(2)}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.netReceivedAmount.toFixed(2)}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.city}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.netComision.toFixed(2)}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.postBy?.name}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.receiverName}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.biltyNumber}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.receiverNumber}
                  </div>
                  <div className="border-r border-r-black peer-checked:bg-gray-200">
                    {transaction.receivedBy}
                  </div>
                  <div className="">{transaction.senderNumber}</div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default DailyTransaction;
