import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDetails } from "../context/UserContext";

// import { Outlet } from "react-router-dom";

function Dashboard({ children }) {
  const auth = JSON.parse(localStorage.getItem("i"));
  const { details, setDetails } = useDetails();
  const [log, setLog] = useState(false);
  const [dash, setDash] = useState(true);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    // sessionStorage.clear();
    setDetails();
    navigate("/login");
  };
  const options = [
    {
      name: "Add Transaction",
      path: "/create-transaction",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M17.5 21h1v-2.5H21v-1h-2.5V15h-1v2.5H15v1h2.5zm.5 2q-2.075 0-3.537-1.463T13 18q0-2.075 1.463-3.537T18 13q2.075 0 3.538 1.463T23 18q0 2.075-1.463 3.538T18 23M7 9h10V7H7zm4.675 12H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v6.7q-.725-.35-1.463-.525T18 11q-.275 0-.513.012t-.487.063V11H7v2h6.125q-.45.425-.812.925T11.675 15H7v2h4.075q-.05.25-.062.488T11 18q0 .825.15 1.538T11.675 21"
          ></path>
        </svg>
      ),
    },
    {
      name: "Add Party",
      path: "/add-party",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
            d="M6.75 9a3.25 3.25 0 1 0 0-6.5a3.25 3.25 0 0 0 0 6.5M17 6.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m-8 8c0-1.704.775-3.228 1.993-4.237A1.991 1.991 0 0 0 10 10H3.5a2 2 0 0 0-2 2s0 4 5.25 4c.953 0 1.733-.132 2.371-.347A5.522 5.522 0 0 1 9 14.5m10 0a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-4-2a.5.5 0 0 0-1 0V14h-1.5a.5.5 0 0 0 0 1H14v1.5a.5.5 0 0 0 1 0V15h1.5a.5.5 0 0 0 0-1H15z"
          ></path>
        </svg>
      ),
    },

    {
      name: "Account Balances",
      path: "/party-list",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5h-8q-1.775 0-2.887 1.113T9 9v6q0 1.775 1.113 2.888T13 19h8q0 .825-.587 1.413T19 21zm8-4q-.825 0-1.412-.587T11 15V9q0-.825.588-1.412T13 7h7q.825 0 1.413.588T22 9v6q0 .825-.587 1.413T20 17zm3-3.5q.65 0 1.075-.425T17.5 12q0-.65-.425-1.075T16 10.5q-.65 0-1.075.425T14.5 12q0 .65.425 1.075T16 13.5"
          ></path>
        </svg>
      ),
    },
    {
      name: "Daily Transaction",
      path: "/daily-transaction",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7 14v-2h10v2zm0 4v-2h7v2zm-2 4q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.587 1.413T19 22zm0-2h14V10H5z"
          ></path>
        </svg>
      ),
    },
    {
      name: "User",
      path: "/user",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"
          ></path>
        </svg>
      ),
    },

    {
      name: "Report Balance",
      path: "/balance-report",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M4 7H2v14c0 1.1.9 2 2 2h14v-2H4M20 3h-3.2c-.4-1.2-1.5-2-2.8-2c-1.3 0-2.4.8-2.8 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-6 0c.6 0 1 .5 1 1s-.5 1-1 1s-1-.5-1-1s.4-1 1-1m-1.7 12.1L9 11.8l1.4-1.4l1.9 1.9L17.6 7L19 8.4"
          ></path>
        </svg>
      ),
    },
    {
      name: "Cashbook",
      path: "/cashbook",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m19 2l-5 4.5v11l5-4.5zM6.5 5C4.55 5 2.45 5.4 1 6.5v14.66c0 .25.25.5.5.5c.1 0 .15-.07.25-.07c1.35-.65 3.3-1.09 4.75-1.09c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.31 4.75 1.06c.1.05.15.03.25.03c.25 0 .5-.25.5-.5V6.5c-.6-.45-1.25-.75-2-1V19c-1.1-.35-2.3-.5-3.5-.5c-1.7 0-4.15.65-5.5 1.5V6.5C10.55 5.4 8.45 5 6.5 5"
          ></path>
        </svg>
      ),
    },
    {
      name: "Transaction Report",
      path: "/transaction-report",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M8 17q.425 0 .713-.288T9 16q0-.425-.288-.712T8 15q-.425 0-.712.288T7 16q0 .425.288.713T8 17m0-4q.425 0 .713-.288T9 12q0-.425-.288-.712T8 11q-.425 0-.712.288T7 12q0 .425.288.713T8 13m0-4q.425 0 .713-.288T9 8q0-.425-.288-.712T8 7q-.425 0-.712.288T7 8q0 .425.288.713T8 9m3 8h6v-2h-6zm0-4h6v-2h-6zm0-4h6V7h-6zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Ledger Report",
      path: "/ledger-report",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <g fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 19a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8.828a3 3 0 0 0-.879-2.12l-3.828-3.83A3 3 0 0 0 14.172 2H6a3 3 0 0 0-3 3v14zm14-8a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0v-6zm-4 2a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0v-4zm-4 1.995a1 1 0 0 0-2 .01l.01 2a1 1 0 0 0 2-.01l-.01-2z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ),
    },
    {
      name: "Commission Ledger Report",
      path: "/commission-ledger-report",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            d="M20 8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM9 19H7v-9h2v9zm4 0h-2v-6h2v6zm4 0h-2v-3h2v3zM14 9h-1V4l5 5h-4z"
            fill="currentColor"
          ></path>
        </svg>
      ),
    },
    {
      name: "Party Commission Report",
      path: "/party-commission-report",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2M7 8c0-.55.45-1 1-1h5c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1m0 3c0-.55.45-1 1-1h5c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1m3 3c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1h1c.55 0 1 .45 1 1m8.29.12l-3.54 3.54a.996.996 0 0 1-1.41 0l-1.41-1.41a.996.996 0 1 1 1.41-1.41l.71.71l2.83-2.83a.996.996 0 0 1 1.41 0c.39.38.39 1.01 0 1.4"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <>
      {auth ? (
        <div className="flex h-svh overflow-y-hidden flex-col justify-between bg-white">
          <div>
            <div className="sticky top-0 z-10 flex bg-[#707CD2]">
              <div className="relative flex w-full justify-between pl-20">
                <div className="flex text-sm font-bold text-white gap-6 items-center h-full">
                  {options.map((option) => (
                    <Link
                      title={option.name}
                      key={option.path}
                      to={option.path}
                      className="flex items-center justify-center text-2xl"
                    >
                      {option.icon}
                    </Link>
                  ))}
                </div>
                <div
                  onClick={() => setLog(!log)}
                  className="ml-auto relative right-10 mt-1 flex h-fit items-center text-white "
                >
                  <img
                    className="h-10 w-10 rounded-full bg-white"
                    src="https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"
                    alt=""
                  />
                  <p className="ml-2 cursor-pointer">{details?.name}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.9em"
                    height="1.9em"
                    viewBox="0 0 24 24"
                  >
                    <path fill="currentColor" d="m12 15l-5-5h10z"></path>
                  </svg>
                  <div
                    className={` ${
                      log
                        ? " rotate-x-0  pointer-events-auto opacity-100"
                        : " rotate-x-90 pointer-events-none opacity-0"
                    } absolute -left-20 top-14 rounded bg-white p-1 text-black duration-300 `}
                  >
                    <div className="flex items-center">
                      <img
                        className="h-16 w-16 rounded-full bg-white"
                        src="https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"
                        alt=""
                      />
                      <div>
                        <p className="ml-2 ">{details?.name}</p>
                        <p className="ml-2 italic text-gray-500 ">
                          {details?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="ml-3 mt-3 flex h-fit cursor-pointer items-center border-t border-black p-2 py-3 text-2xl text-slate-500 duration-100 hover:bg-slate-200 "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M11 12V4q0-.425.288-.712T12 3q.425 0 .713.288T13 4v8q0 .425-.288.713T12 13q-.425 0-.712-.288T11 12m1 9q-1.85 0-3.488-.712T5.65 18.35q-1.225-1.225-1.937-2.863T3 12q0-1.725.638-3.312T5.425 5.85q.275-.3.7-.3t.725.3q.275.275.25.688t-.3.737q-.85.95-1.325 2.163T5 12q0 2.9 2.05 4.95T12 19q2.925 0 4.963-2.05T19 12q0-1.35-.475-2.588t-1.35-2.187q-.275-.3-.288-.7t.263-.675q.3-.3.725-.3t.7.3q1.175 1.25 1.8 2.838T21 12q0 1.85-.712 3.488t-1.925 2.862q-1.213 1.225-2.85 1.938T12 21"
                        ></path>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-full justify-between">
              <div className={`w-full duration-200 `}>{children}</div>
            </div>
          </div>
          <p className="flex justify-center gap-1 h-10 w-full items-center bg-white text-center">
            Developed with ❤️ by{" "}
            <a
              href="https://techincept.com/"
              target="blank"
              className="hover:underline"
            >
              Tech Incept
            </a>
            .
          </p>
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}

export default Dashboard;
