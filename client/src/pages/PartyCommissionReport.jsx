import Dashboard from "../components/Dashboard";

function PartyCommissionReport() {
  const tableHead = [
    "Id",
    "Party",
    "Party Contact Name",
    "Party Contact Number",
    "Commission",
  ];
  return (
    <Dashboard>
      <div className="relative ">
        <p className="skew-y-4 w-full bg-white p-6 text-xl">BALANCE REPORT</p>
        <div className="mx-auto my-5  grid w-[98%] bg-white p-10">
          <p className="mb-1 rounded-t text-center text-xl text-white">
            Search
          </p>
          <div className="flex items-center gap-32">
            <div className="grid ">
              <label htmlFor="month">Month</label>
              <select
                className="mt-2 w-80 rounded border px-3 py-1.5"
                name="month"
                id=""
              >
                {Array(12)
                  .fill(0)
                  .map((item, idx) => (
                    <option value={idx + 1} key={idx}>
                      {idx + 1}
                    </option>
                  ))}
              </select>
            </div>
            <button className="h-fit rounded bg-green-500 px-3 py-1.5 text-white hover:bg-green-400 ">
              Search
            </button>
          </div>

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
                    className=" flex w-1/2 items-center  justify-between gap-2 border py-3 pl-10 pr-5"
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
              <tr className="h-10 bg-blue-50 pt-5 text-center">
                No date Available
              </tr>
            </tbody>
            <tfoot className="pt-5">
              <td className="">Showing 0 to 0 of 0 entries</td>
              <tr>
                <td className="full float-right">
                  <button className="border p-1 px-3 hover:bg-gray-200">
                    Prev
                  </button>
                  <span className="bg-blue-500 px-3 py-1.5 text-white">0</span>
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

export default PartyCommissionReport;
