import React from "react";
import Dashboard from "../components/Dashboard";
import { useDetails } from "../context/UserContext";

function DashboardPage() {
  const { details } = useDetails();
  return (
    <Dashboard>
      <div className="mx-5 flex h-fit justify-between rounded bg-white p-5">
        <div>
          <p>Dashboard</p>
          <p className="mt-2 text-sm">Welcome {details?.name}</p>
        </div>
        <svg
          className="animate-spin cursor-pointer rounded-full bg-[#707CD2] p-2 text-white duration-100 hover:bg-[#707CD8]"
          xmlns="http://www.w3.org/2000/svg"
          width="2em"
          height="2em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M10.125 22q-.375 0-.65-.25t-.325-.625l-.3-2.325q-.325-.125-.612-.3t-.563-.375l-2.175.9q-.35.15-.7.038t-.55-.438L2.4 15.4q-.2-.325-.125-.7t.375-.6l1.875-1.425Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L2.65 9.9q-.3-.225-.375-.6t.125-.7l1.85-3.225q.2-.325.55-.437t.7.037l2.175.9q.275-.2.575-.375t.6-.3l.3-2.325q.05-.375.325-.625t.65-.25h3.75q.375 0 .65.25t.325.625l.3 2.325q.325.125.613.3t.562.375l2.175-.9q.35-.15.7-.038t.55.438L21.6 8.6q.2.325.125.7t-.375.6l-1.875 1.425q.025.175.025.338v.674q0 .163-.05.338l1.875 1.425q.3.225.375.6t-.125.7l-1.85 3.2q-.2.325-.562.45t-.713-.025l-2.125-.9q-.275.2-.575.375t-.6.3l-.3 2.325q-.05.375-.325.625t-.65.25zM11 20h1.975l.35-2.65q.775-.2 1.438-.587t1.212-.938l2.475 1.025l.975-1.7l-2.15-1.625q.125-.35.175-.737T17.5 12q0-.4-.05-.787t-.175-.738l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.212-.962t-1.438-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.55.575 1.213.963t1.437.587zm1.05-4.5q1.45 0 2.475-1.025T15.55 12q0-1.45-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12q0 1.45 1.013 2.475T12.05 15.5M12 12"
          ></path>
        </svg>
      </div>
      <div className="mx-auto mt-5 grid h-36 w-1/2 items-center justify-between bg-white p-5">
        <p>Your Total Commission</p>

        <p>{details?.commission?.toFixed(2)}</p>
      </div>
    </Dashboard>
  );
}

export default DashboardPage;
