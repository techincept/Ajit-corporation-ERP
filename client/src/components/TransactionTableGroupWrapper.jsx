import { Select } from "antd";
import { useContext, useEffect } from "react";
import { useParty } from "../context/Party";
import { searchDataContext } from "../context/SearchDataContext";
import InputBox from "./InputBox";
import TransactionTable from "./TransactionTable";

function TransactionTableGroupWrapper() {
  const {
    allSearchData,
    setAllSearchData,
    search,
    setSearch,
    fetchSearch,
    selectedParties,
    setSelectedParties,
    fetchAllTransactions,
    setIsLoading,
    isLoading,
  } = useContext(searchDataContext);

  const { allParties } = useParty();

  useEffect(() => {
    fetchSearch();
  }, [search.from, search.to, selectedParties, setAllSearchData]);

  const handleDateUnitChange = (increment) => {
    let currentFromDate = new Date(search.from);
    let currentToDate = new Date(search.to);

    currentFromDate.setDate(currentFromDate.getDate() + increment);
    currentToDate.setDate(currentToDate.getDate() + increment);

    currentFromDate = currentFromDate.toISOString().split("T")[0];
    currentToDate = currentToDate.toISOString().split("T")[0];

    setSearch((Pre) => ({
      ...Pre,
      from: currentFromDate,
      to: currentToDate,
    }));
  };

  return (
    <div className="flex flex-col items-center mx-auto">
      <div className="flex items-end gap-2 w-full">
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
        <div>
          <label htmlFor="" className="grid w-max gap-1">
            From Date:
            <input
              onChange={(e) => {
                setSearch((Pre) => ({ ...Pre, from: e.target.value }));
              }}
              type="date"
              name=""
              id=""
              value={search.from}
              className="rounded-none border p-1 border-gray-400"
            />
          </label>
        </div>
        <InputBox
          className="w-36"
          onChange={(e) => {
            setSearch((Pre) => ({
              ...Pre,
              date: e.target.value,
              to: e.target.value,
            }));
          }}
          label="To Date:"
          type="date"
          value={search.to}
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
        <Select
          optionFilterProp="label"
          mode="multiple"
          className="multi-select-antd"
          allowClear
          style={{ width: "100%", flex: 1, minWidth: "20rem" }}
          placeholder="Please select"
          onChange={setSelectedParties}
          value={selectedParties}
          options={allParties?.map((item) => ({
            value: item._id,
            label: item.name,
          }))}
        />
        <button
          className="h-8 w-28 flex items-center justify-center bg-teal-600 text-white rounded"
          onClick={() => {
            fetchAllTransactions();
            setIsLoading(true);
          }}
        >
          {!isLoading ? (
            "Select All"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
              >
                <animateTransform
                  attributeName="transform"
                  dur="0.75s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                ></animateTransform>
              </path>
            </svg>
          )}
        </button>
        <button
          className="h-8 w-28 flex items-center justify-center bg-orange-500 text-white rounded"
          onClick={() => {
            setSelectedParties([]);
            setAllSearchData([]);
          }}
        >
          Clear All
        </button>
      </div>
      <div className="h-[calc(100vh-7rem)] overflow-x-scroll flex flex-col gap-4 p-4">
        {allSearchData.map((searchData, idx) => (
          <TransactionTable key={idx} data={searchData} />
        ))}
      </div>
    </div>
  );
}
export default TransactionTableGroupWrapper;
