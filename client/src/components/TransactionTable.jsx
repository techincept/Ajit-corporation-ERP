import { useContext, useEffect, useRef, useState } from "react";
import { searchDataContext } from "../context/SearchDataContext";
function TransactionTable({ data }) {
  const { search, seachData } = data;

  const { parties, setTransactionTransporter, setIsFormFilled } =
    useContext(searchDataContext);

  const [filteredData, setFilteredData] = useState([]);
  const [dayOpeningBalance, setDayOpeningBalance] = useState();
  const [selected, setSelected] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState([]);
  const [openingSelected, setOpeningSelected] = useState(false);

  const [selectedData, setSelectedData] = useState({
    credit: 0,
    debit: 0,
  });

  useEffect(() => {
    let debit = selected.length
      ? filteredData.reduce((acc, data) => acc + +data.NetDebit, 0) -
        selectedTotal.reduce((acc, data) => acc + +data.NetDebit, 0)
      : filteredData.reduce((acc, data) => acc + +data.NetDebit, 0);

    let credit = selected.length
      ? filteredData.reduce((acc, data) => acc + +data.NetCredit, 0) -
        selectedTotal.reduce((acc, data) => acc + +data.NetCredit, 0)
      : filteredData.reduce((acc, data) => acc + +data.NetCredit, 0);

    if (!openingSelected) {
      debit -= dayOpeningBalance?.debit;
      credit += dayOpeningBalance?.credit;
    }

    debit = Number(debit).toFixed(2);
    credit = Number(credit).toFixed(2);

    setSelectedData({ debit, credit });
  }, [
    selected,
    openingSelected,
    dayOpeningBalance,
    filteredData,
    selectedTotal,
  ]);

  const handleSelection = (e) => {
    if (e.target.checked) {
      setSelected((prev) => [...prev, e.target.value]);
    } else {
      const newSelected = [...selected];
      const idx = newSelected.findIndex((item) => item == e.target.value);
      newSelected.splice(idx, 1);
      setSelected(newSelected);
    }
  };

  useEffect(() => {
    const pickedData = filteredData.filter((data) =>
      selected.includes(data.id)
    );
    setSelectedTotal(pickedData);
  }, [filteredData, selected]);

  const sendData = (id) => {
    const index = seachData.transaction.findIndex(
      (item) => String(item._id) === String(id)
    );

    console.table(index);
    setTransactionTransporter(seachData.transaction[index]);
    setIsFormFilled(true);
  };

  useEffect(() => {
    // filter Transaction data
    let newData = seachData?.transaction?.map((data) => {
      const obj = {
        date: data.date.split("T")[0].split("-").reverse().join("-"),
        voucherNumber: data.voucherNumber,

        amountDr: data.amount,
        cgsBySender: data.receiverCommission,
        cgsSender: data.receiverCommissionPercentage + " %",
        NetDebit: data.netPaidAmount,

        receiverName: data.receiverName,
        city: data.city,

        amountCr: data.amount,
        cgsByReceiver: data.senderCommission,
        cgsReceiver: data.senderCommissionPercentage + " %",
        NetCredit: data.netReceivedAmount,

        balance: 0,
        // crDr: data.netPaidAmount.toFixed(2),
        // netReceivedAmount: data.netReceivedAmount.toFixed(2),
        id: data._id,
      };

      if (String(data.paidTo._id) === String(search.party)) {
        obj.amountCr = 0;
        obj.cgsByReceiver = 0;
        obj.cgsReceiver = 0;
        obj.NetCredit = 0;
        obj.balance = data.sCurrentBalance;
      } else {
        obj.amountDr = 0;
        obj.cgsBySender = 0;
        obj.cgsSender = 0;
        obj.NetDebit = 0;
        obj.balance = data.rCurrentBalance;
      }

      return obj;
    });

    newData = newData ? newData : [];
    // filter cashbook

    let newCashbook = seachData?.cashbook?.map((item) => ({
      date: item.date.split("T")[0].split("-").reverse().join("-"),
      voucherNumber: item.voucherNumber,
      name: item.party.name,
      credit: item.type == "credit" ? item.amount.toFixed(2) : 0,
      debit: item.type == "credit" ? 0 : item.amount.toFixed(2),
      currentBalance: Number(item.currentBalance).toFixed(2),
      id: item._id,
    }));
    newCashbook = newCashbook ? newCashbook : [];

    setFilteredData([...newData, ...newCashbook]);
  }, [seachData, search.party]);

  useEffect(() => {
    let balance;
    let party = parties.find((party) => party._id === search.party);

    const createDate = new Date(party?.createdAt);
    const searchDate = new Date(search.date);

    if (filteredData.length == 0 && createDate < searchDate) {
      balance = party.currentBalance;
    } else if (filteredData.length == 0 && createDate >= searchDate) {
      balance =
        party.type == "credit"
          ? party.openingBalance
          : party.openingBalance * -1;
    }

    if (filteredData.length) {
      const fCredit = filteredData[0].NetCredit;
      const fDebit = filteredData[0].NetDebit;
      const fBalance = filteredData[0].balance;

      balance = fBalance + fDebit - fCredit;
    }

    setDayOpeningBalance({
      date: search.from.split("-").reverse().join("-"),
      debit: balance < 0 ? balance : 0,
      credit: balance >= 0 ? balance : 0,
      openingBalance: balance,
      type: balance < 0 ? "DR" : "CR",
    });
  }, [filteredData, parties, search.date, search.from, search.party]);

  const ref = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const scroll = ref.current.scrollTop;

      if (key === "ArrowDown") {
        ref.current.scrollTo({
          top: scroll + 40,
          behavior: "instant",
        });
      }
      if (key === "ArrowUp") {
        ref.current.scrollTo({
          top: scroll - 40,
          behavior: "instant",
        });
      }
      if (key === "ArrowLeft") {
        window.scrollTo({
          left: window.scrollLeft - 40,
          behavior: "instant",
        });
      }
      if (key === "ArrowRight") {
        window.scrollTo({
          left: window.scrollLeft + 40,
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
    <div className="grid h-fit w-full text-sm bg-violet-100 p-2 shadow-xl border border-violet-400 ">
      <span className="font-bold text-lg pb-1">{search?.name}</span>
      <div className="border relative border-black max-h-[calc(100vh-13rem)] mx-auto w-max overflow-auto bg-white font-semibold">
        <div className="w-full h-full grid content-start pb-5">
          <div className="grid">
            <div className="flex border-b border-b-black shrink-0">
              <div className="border-r border-r-black shrink-0 bg-pink-200 w-[15rem] text-center">
                Misculess
              </div>
              <div className="border-r border-r-black shrink-0 bg-pink-200 w-[20rem] text-center">
                Paid
              </div>
              <div className="border-r border-r-black shrink-0 bg-pink-200 w-[10rem] text-center">
                Narration
              </div>
              <div className="border-r border-r-black shrink-0 bg-pink-200 w-[20rem] text-center">
                Received
              </div>
              <div className="w-[10rem] text-center bg-pink-200">
                Balance Cr/Dr
              </div>
            </div>
            <div className="flex border-b border-b-black shrink-0">
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-orange-100">
                S.No.
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-orange-100">
                Date
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-orange-100">
                V.No
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-green-200">
                Amt. Dr.
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-green-200">
                Cgs. By
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-green-200">
                Cgs
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-green-200">
                Net Debit
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-orange-100">
                Receiver
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-orange-100">
                City
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-green-200">
                Amt. Cr
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-green-200">
                Cgs. By
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-green-200">
                Cgs
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-green-200">
                Net Credit
              </div>
              <div className="border-r border-r-black shrink-0 w-20 text-center bg-orange-100">
                Balance
              </div>
              <div className="w-20 text-center shrink-0 bg-orange-100">
                Cr/Dr
              </div>
            </div>
            <div className="flex border-b border-b-black shrink-0">
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                1
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                2
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                3
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                4
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                5
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                6
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                7
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                8
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                9
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                10
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                11
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                12
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                13
              </div>
              <div className="border-r border-r-black shrink-0 w-20  bg-pink-200 text-center">
                14
              </div>
              <div className="shrink-0 w-20 text-center bg-pink-200 ">15</div>
            </div>
          </div>
          {dayOpeningBalance && (
            <label
              htmlFor="opening"
              className="flex w-full border-b text-center border-black bg-sky-100"
            >
              <div className="w-20 border-r border-black">
                <input
                  type="checkbox"
                  name="opening"
                  id="opening"
                  checked={openingSelected ? true : false}
                  onChange={(e) => {
                    if (e.target.checked) setOpeningSelected(true);
                    else setOpeningSelected(false);
                  }}
                />
              </div>
              <div className="w-20 border-r border-black">
                {dayOpeningBalance.date}
              </div>
              <div className="w-20 border-r border-black">
                {dayOpeningBalance.voucherNumber}
              </div>
              <div className="w-[15rem] border-r border-black">
                {dayOpeningBalance.name}
              </div>
              <div
                className={`w-20 border-r border-black ${dayOpeningBalance.debit < 0 ? "text-red-600" : "text-green-600"}`}
              >
                {dayOpeningBalance.debit < 0
                  ? (dayOpeningBalance.debit * -1).toFixed(2)
                  : dayOpeningBalance.debit.toFixed(2)}
              </div>
              <div className="w-[25rem] border-r border-black">
                {dayOpeningBalance.name}
              </div>
              <div
                className={`w-20 border-r border-black ${dayOpeningBalance.credit < 0 ? "text-red-600" : "text-green-600"}`}
              >
                {dayOpeningBalance.credit < 0
                  ? (dayOpeningBalance.credit * -1).toFixed(2)
                  : dayOpeningBalance.credit.toFixed(2)}
              </div>
              <div
                className={`w-20 border-r border-black ${dayOpeningBalance.openingBalance < 0 ? "text-red-600" : "text-green-600"}`}
              >
                {dayOpeningBalance.openingBalance < 0
                  ? (dayOpeningBalance.openingBalance * -1).toFixed(2)
                  : Number(dayOpeningBalance.openingBalance).toFixed(2)}
              </div>
              <div
                className={`w-20 ${dayOpeningBalance.credit <= 0 ? "text-red-600" : "text-green-600"}`}
              >
                {dayOpeningBalance.type}
              </div>
            </label>
          )}
          <div
            className="min-w-full overflow-y-scroll grid overflow-x-hidden whitespace-nowrap"
            ref={ref}
          >
            {[...filteredData]
              .sort(
                (a, b) =>
                  new Date(a.date.split("-").reverse().join("-")) -
                  new Date(b.date.split("-").reverse().join("-"))
              )
              .map((data, idx) => (
                <div
                  key={idx}
                  className={`flex text-center border-b border-black  shrink-0 cursor-pointer ${selected.includes(data.id) ? "bg-purple-200 hover:bg-purple-100" : "hover:bg-gray-200"}`}
                  onClick={
                    data.voucherNumber[0].toUpperCase() == "T"
                      ? () => sendData(data.id)
                      : undefined
                  }
                >
                  <label
                    htmlFor={data.id}
                    onClick={(e) => e.stopPropagation()}
                    className="border-r cursor-pointer hover:bg-purple-200 border-black w-20 shrink-0 flex items-center justify-center gap-2"
                  >
                    <input
                      checked={selected.includes(data.id)}
                      className="-ml-5 accent-purple-600"
                      type="checkbox"
                      name={data.id}
                      id={data.id}
                      value={data.id}
                      onChange={handleSelection}
                    />
                    {idx + 1}
                  </label>
                  <div className="border-r border-black w-20 shrink-0 py-1">
                    {data.date}
                  </div>
                  <div className="border-r border-black w-20 shrink-0 py-1">
                    {data.voucherNumber}
                  </div>
                  <div className="border-r border-black w-20 shrink-0 py-1">
                    {data.amountDr.toFixed(2)}
                  </div>
                  <div className="border-r border-black w-20 shrink-0 py-1">
                    {data.cgsSender}
                  </div>
                  <div className="border-r border-black w-20 shrink-0 py-1">
                    {data.cgsBySender.toFixed(2)}
                  </div>
                  <div className="border-r border-black w-20 shrink-0 py-1 text-red-600">
                    {data.NetDebit.toFixed(2)}
                  </div>
                  <div
                    className="border-r border-black w-20 shrink-0 py-1 text-ellipsis px-2 whitespace-nowrap overflow-hidden"
                    title={data.receiverName}
                  >
                    {data.receiverName}
                  </div>
                  <div
                    className="border-r border-black w-20 shrink-0 py-1 whitespace-nowrap overflow-hidden text-ellipsis px-1"
                    title={data.city}
                  >
                    {data.city}
                  </div>
                  <div className="border-r border-black w-20 shrink-0 py-1">
                    {data.amountCr.toFixed(2)}
                  </div>
                  <div className="border-r border-black w-20 shrink-0 py-1">
                    {data.cgsReceiver}
                  </div>
                  <div className="border-r border-black w-20 shrink-0 py-1">
                    {data.cgsByReceiver.toFixed(2)}
                  </div>
                  <div className="border-r border-black w-20 shrink-0 py-1 text-green-600">
                    {data.NetCredit.toFixed(2)}
                  </div>
                  <div
                    className={`border-r border-black w-20 shrink-0 py-1 ${data.balance < 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {data.balance < 0
                      ? (data.balance * -1).toFixed(2)
                      : data.balance.toFixed(2)}
                  </div>
                  <div className="w-20 shrink-0">
                    {data.balance > 0 ? (
                      <span className="text-green-600">CR</span>
                    ) : (
                      <span className="text-red-600">DR</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className="w-[75rem] border-t border-black absolute bottom-0 bg-green-200 flex mt-auto">
            <div className="w-[30rem] border-r pr-2 border-black text-right">
              Total Debit:
            </div>
            <div className="w-20 border-r border-black text-center">
              {Number(selectedData.debit).toFixed(2)}
            </div>
            <div className="w-[25rem] border-r pr-2 border-black text-right">
              Total Credit:
            </div>
            <div className="w-20 text-center border-r border-black">
              {selectedData.credit}
            </div>
            <div
              className={`w-20 text-center border-r border-black ${selectedData.credit - selectedData.debit < 0 ? "text-red-600" : "text-green-600"}`}
            >
              {Math.abs(selectedData.credit - selectedData.debit).toFixed(2)}
            </div>
            <div
              className={`w-20 text-center  ${selectedData.credit - selectedData.debit < 0 ? "text-red-600" : "text-green-600"}`}
            >
              {selectedData.credit - selectedData.debit < 0 ? "DR" : "CR"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionTable;
