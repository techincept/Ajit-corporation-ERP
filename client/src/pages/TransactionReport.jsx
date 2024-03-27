import React from "react";
import Dashboard from "../components/Dashboard";
import InputBox from "../components/InputBox";

function TransactionReport() {
  return (
    <Dashboard>
      <p className="bg-white p-10 py-5">TRANSACTION REPORT</p>
      <form className="ml-5 mt-5 grid h-fit     w-[97%] justify-between rounded bg-white p-5">
        <div className="flex gap-20">
          <InputBox
            label="From Date"
            type="date"
            className="w-60 py-1 text-gray-600"
            name="fromDate"
          />
          <InputBox
            label="To Date"
            type="date"
            className="w-60 py-1 text-gray-600"
            name="toDate"
          />
          <div className="grid">
            <label htmlFor="party">Party</label>
            <select
              className="w-60 border  border-gray-500 px-3 py-1 text-gray-600"
              name="party"
              id=""
            >
              <option value="">Select Party</option>
            </select>
          </div>
        </div>
        <button className="mt-10 h-fit w-fit rounded bg-green-500 px-3 py-1.5 text-white hover:bg-green-400">
          Search
        </button>
      </form>
    </Dashboard>
  );
}

export default TransactionReport;
