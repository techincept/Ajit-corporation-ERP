import { Select } from "antd";
import { useEffect, useState } from "react";
import { useParty } from "../context/Party";
import { useTransaction } from "../context/Transaction.JSx";
function PartyTable() {
  const { setIsEditMode } = useTransaction();
  const { setParty, allParties } = useParty();

  const [filteredData, setFilteredData] = useState([]);
  const [selectedParties, setSelectedParties] = useState([]);

  useEffect(() => {
    if (selectedParties.length) {
      const newData = allParties.filter((party) =>
        selectedParties.includes(party._id)
      );
      setFilteredData(newData);
    } else {
      setFilteredData(allParties);
    }
  }, [allParties, selectedParties]);

  function calculateTotal() {
    let totalCredit = 0;
    let totalDebit = 0;

    for (let partyItem of allParties) {
      if (partyItem.type == "debit") {
        totalDebit -= partyItem.openingBalance;
      } else {
        totalCredit += partyItem.openingBalance;
      }
    }

    return { totalCredit, totalDebit };
  }

  return (
    <div className="relative h-[calc(100vh-180px)] w-full">
      <div className="flex items-center pb-4 gap-10 justify-end">
        Search:
        <Select
          optionFilterProp="label"
          mode="multiple"
          className="multi-select-antd"
          allowClear
          style={{ minWidth: "20rem" }}
          placeholder="Please select"
          onChange={setSelectedParties}
          value={selectedParties}
          options={allParties?.map((item) => ({
            value: item._id,
            label: item.name,
          }))}
        />
      </div>
      <table className=" w-full h-full">
        <thead className="flex h-fit w-full overflow-y-scroll">
          <tr className="grid w-full grid-cols-[100px_1fr_1fr_2fr_50px] bg-violet-200">
            <td className="flex items-center justify-center gap-2 border border-violet-400 px-6 text-center">
              Id
            </td>
            <td className="flex items-center justify-center gap-2 border border-violet-400 px-6 text-center">
              Party
            </td>
            <td className="flex items-center justify-center gap-2 border border-violet-400 px-6 text-center">
              City
            </td>
            <td className="flex flex-col items-center justify-between border border-violet-400 text-center">
              <span className="px-2">Opening Balance</span>
              <div className="flex w-full items-center border-t border-violet-400 ">
                <span className="flex-1 px-2 py-1 text-center ">Credit</span>
                <span className="flex-1 border-l border-violet-400 px-2 py-1 text-center ">
                  Debit
                </span>
              </div>
            </td>
            <td className="flex items-center justify-center gap-2 border border-violet-400 px-6 text-center">
              Action
            </td>
          </tr>
        </thead>
        <div className="grid w-full h-[calc(100vh-220px)] overflow-y-scroll">
          <tbody className="w-full pb-4">
            {filteredData.map((item, idx) => (
              <tr
                className="relative grid w-full grid-cols-[100px_1fr_1fr_2fr_50px] even:bg-slate-100"
                key={idx}
              >
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                <td className="border px-2 py-1 text-center capitalize">
                  {item.name}
                </td>
                {/* <td className="border text-center px-2 py-1">{item.wallet}</td> */}
                <td className="border px-2 py-1 text-center capitalize">
                  {item.city}
                </td>
                <td className="border text-center">
                  {item.type == "credit" || !item.type ? (
                    <div className="grid grid-cols-2">
                      <span className="border-r px-1 py-2 text-green-600">
                        {item.openingBalance.toFixed(2)}
                      </span>
                      <span className=" px-1 py-2 text-red-600">0.00</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2">
                      <span className="border-r px-1 py-2 text-green-600">
                        0.00
                      </span>
                      <span className=" px-1 py-2 text-red-600">
                        {item.openingBalance.toFixed(2)}
                      </span>
                    </div>
                  )}
                </td>
                <td className="flex gap-1  border px-2 py-1 text-center ">
                  <svg
                    onClick={() => {
                      setParty({
                        id: item._id,
                        name: item.name,
                        city: item.city,
                        openingBalance: item.openingBalance,
                        type: item.type,
                      });
                      setIsEditMode(true);
                    }}
                    className="cursor-pointer rounded-full border border-blue-500 p-1 text-center text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4q0 .375-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"
                    ></path>
                  </svg>
                  {/* <svg
                        className="cursor-pointer rounded-full border border-blue-500 p-1 text-center text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5q0-.425.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8q-.425 0-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8q-.425 0-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"
                        ></path>
                      </svg> */}
                </td>
              </tr>
            ))}
          </tbody>
        </div>
        <tfoot className="absolute bottom-0 grid w-full grid-cols-[100px_1fr_1fr_2fr_50px] overflow-y-scroll border bg-amber-100">
          <div className="border-r border-black text-center font-bold col-span-2">
            {calculateTotal().totalCredit - calculateTotal().totalCredit}
          </div>
          <div className="border-r border-black text-center font-bold">
            Total:{" "}
          </div>
          <div className="grid grid-cols-2 border-r">
            <div className="text-center font-bold text-green-600 border-r border-black">
              {calculateTotal().totalCredit.toFixed(2)}
            </div>
            <div className="border-l text-center font-bold text-red-600">
              {(calculateTotal().totalDebit * -1).toFixed(2)}
            </div>
          </div>
          <div></div>
        </tfoot>
      </table>
    </div>
  );
}

export default PartyTable;
