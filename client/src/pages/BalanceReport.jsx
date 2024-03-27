import React from "react";
import Dashboard from "../components/Dashboard";
import InputBox from "../components/InputBox";

function BalanceReport() {
  const tableHead = ["Id", "Pary", "Amount", "Date"];
  const party = [
    {
      party: "CREDIT",
      amount: "0",
      date: "0",
    },
    {
      party: "DEBIT",
      amount: "0",
      date: "0",
    },
  ];
  return (
    <Dashboard>
      <div className="relative ">
        <p className="skew-y-4 w-full bg-white p-6 text-xl">BALANCE REPORT</p>
        <div className="mx-auto my-5 grid w-[98%] bg-white p-10">
          <p className="mb-1 rounded-t bg-cyan-600 text-center text-xl text-white">
            Search
          </p>
          <div className="flex items-center gap-32">
            <InputBox
              className="w-48 border-gray-500 py-1 uppercase text-gray-500"
              label="From Date"
              name="fromDate"
              type="date"
            />
            <InputBox
              className="w-48 border-gray-500 py-1 uppercase text-gray-500"
              label="To Date"
              name="toDate"
              type="date"
            />
            <button className="h-fit rounded bg-green-500 px-3 py-1.5 text-white hover:bg-green-400 ">
              Search
            </button>
          </div>
          <p className="my-3 text-xl text-red-500">
            If it is in minus, then take it from the company and if it is in
            plus, give it to the company
          </p>
          <div className="flex w-full  justify-between">
            <div className="mt-5 flex gap-1 text-sm">
              <button className="rounded-sm border border-gray-500 bg-gray-200 p-2 px-3 hover:bg-gray-300">
                Copy
              </button>
              <button className="rounded-sm border border-gray-500 bg-gray-200 p-2 px-3 hover:bg-gray-300">
                Excel
              </button>
              <button className="rounded-sm border border-gray-500 bg-gray-200 p-2 px-3 hover:bg-gray-300">
                CSV
              </button>
              <button className="rounded-sm border border-gray-500 bg-gray-200 p-2 px-3 hover:bg-gray-300">
                PDF
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="search">Search : </label>
              <input type="text" className="border p-1" />
            </div>
          </div>
          <table className=" relative mt-10">
            <thead className=" flex">
              <tr className="flex w-full ">
                {tableHead.map((item, idx) => (
                  <td
                    key={idx}
                    className=" flex w-1/2 items-center  justify-between gap-2 border py-2 pl-10 pr-5 "
                  >
                    {item}
                    <svg
                      className="text-slate-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      height="18px"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 3v18m-7-3l-3 3l-3-3m3 3V3m13 3l-3-3l-3 3"
                      ></path>
                    </svg>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {party.map((item, idx) => (
                <tr
                  className={` ${idx % 2 == 0 ? "bg-blue-50" : "bg-white"} ${
                    item.party == "CREDIT" ? "text-green-500" : "text-red-500"
                  } flex w-full border-b border-l`}
                  key={idx}
                >
                  <td className="flex-1 border-r px-3 py-2 text-center">
                    {idx + 1}
                  </td>
                  <td className="flex-1 border-r px-3 py-2 text-center">
                    {item.party}
                  </td>
                  <td className="flex-1 border-r px-3 py-2 text-center">
                    {item.amount}
                  </td>
                  <td className="flex-1 border-r px-3 py-2 text-center">
                    {item.date}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="pt-5">
              <td className="">Showing 2 to 2 of {party.length} entries</td>
              <tr>
                <td className="full float-right">
                  <button className="border p-1 px-3 hover:bg-gray-200">
                    Prev
                  </button>
                  <span className="bg-blue-500 px-3 py-1.5 text-white">
                    {party.length}
                  </span>
                  <button className="border p-1 px-3 hover:bg-gray-200">
                    Next
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Dashboard>
  );
}

export default BalanceReport;
