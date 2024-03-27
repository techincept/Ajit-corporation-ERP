import Dashboard from "../components/Dashboard";
import { useDetails } from "../context/UserContext";

function User() {
  const { users } = useDetails();
  const tableHead = [
    "Id",
    "Name",
    "User Name",
    "Mobile",
    "Email",
    "Role",
    "Party",
    "Action",
  ];

  return (
    <div>
      <Dashboard>
        <div className="relative ">
          <p className="skew-y-4 w-full bg-white p-6 text-xl"> USERS</p>
          <div className="mx-auto mt-5 grid w-[98%] bg-white p-10">
            <button className="h-fit w-fit rounded bg-[#707CD2] px-4 py-1 pb-2 text-white ">
              <span className="text-2xl font-bold">+</span> Add New User
            </button>
            <div className="flex w-full  justify-between">
              <p className="mt-5">
                Show
                <select
                  className="mx-2 border border-black p-2"
                  name="entries"
                  id=""
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                entries
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="search">Search : </label>
                <input type="text" className="border p-1" />
              </div>
            </div>
            <table className=" relative mt-10">
              <thead className=" flex">
                <tr className="relative grid w-full grid-cols-8 justify-between border-r">
                  {tableHead.map((item, idx) => (
                    <td
                      key={idx}
                      className="flex items-center justify-between border border-r-0 px-3 py-2"
                    >
                      {item}
                      <svg
                        className="text-slate-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="25px"
                        height="25px"
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
                {users?.map((item, idx) => (
                  <tr
                    key={idx}
                    className={` ${
                      idx % 2 == 0 ? "bg-slate-100" : ""
                    } grid w-full grid-cols-8 border-r text-sm`}
                  >
                    <td className="border border-t-0 px-1 py-2">{idx + 1}</td>
                    <td className="border border-t-0 px-1 py-2">{item.name}</td>
                    <td className="border border-t-0 px-1 py-2">
                      {item.userName}
                    </td>
                    <td className="border border-t-0 px-1 py-2">
                      {item.mobile}
                    </td>
                    <td className="border border-t-0 px-1 py-2">
                      {item.email}
                    </td>
                    <td className="border border-t-0 px-1 py-2">{item.role}</td>
                    <td className="border border-t-0 px-1 py-2">
                      {item.party}
                    </td>
                    <td className="flex gap-1 border border-t-0 px-1 py-2">
                      <svg
                        className="rounded-full border border-blue-500 p-1 text-blue-500"
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
                      <svg
                        className="rounded-full border border-blue-500 p-1 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5q0-.425.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8q-.425 0-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8q-.425 0-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"
                        ></path>
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="pt-5">
                <td className="">Showing 2 to 2 of {users.length} entries</td>
                <tr>
                  <td className="5/6 float-right">
                    <button className="border p-1 px-3 hover:bg-gray-200">
                      Prev
                    </button>
                    <span className="h-full bg-blue-500 px-3 py-1.5 text-white">
                      {users.length}
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
    </div>
  );
}

export default User;
