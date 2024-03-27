import { Select } from "antd";
import axios from "axios";
import { useContext, useLayoutEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import InputBox from "../components/InputBox";
import TransactionTableGroupWrapper from "../components/TransactionTableGroupWrapper";
import { searchDataContext } from "../context/SearchDataContext";

function AddTransaction() {
  const {
    isFormFilled,
    transactionDetails,
    config,
    fetchParties,
    setTransactionDetails,
    initialTransaction,
    transactionTransporter,
    setIsFormFilled,
    parties,
    isEditMode,
    setIsEditMode,
    setTransactionTransporter,
    isLoading,
    setIsLoading,
    hideForm,
    fetchSearch,
    setHideForm,
  } = useContext(searchDataContext);

  const [paidByState, setPaidByState] = useState("");

  useLayoutEffect(() => {
    if (Number(paidByState)) {
      setTransactionDetails((prev) => ({
        ...prev,
        senderNumber: paidByState,
        receivedBy: "0",
      }));
    } else {
      setTransactionDetails((prev) => ({
        ...prev,
        receivedBy: paidByState,
        senderNumber: 1,
      }));
    }
  }, [paidByState, setTransactionDetails]);

  async function handleDelete() {
    const confirm = window.confirm("Are your sure?");
    if (!confirm) return;
    setIsLoading(true);

    try {
      await axios.delete(
        `https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/transaction/${transactionDetails._id}`,
        config
      );
      fetchSearch();
      setIsLoading(false);

      setTransactionDetails((prev) => ({
        ...initialTransaction,
        paidTo: prev.paidTo,
        sender: prev.sender,
      }));

      setTransactionTransporter((prev) => ({
        ...initialTransaction,
        paidTo: prev.paidTo,
        sender: prev.sender,
      }));

      setIsEditMode(false);
      setIsFormFilled(false);
      fetchParties();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isFormFilled && !isEditMode) {
        await axios.post(
          "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/transaction/",
          {
            ...transactionDetails,
            amount: Number(transactionDetails.amount),
            receiverCommissionPercentage: Number(
              transactionDetails.receiverCommissionPercentage
            ),
            senderCommissionPercentage: Number(
              transactionDetails.senderCommissionPercentage
            ),
          },
          config
        );

        fetchSearch();
        fetchParties();
        setTransactionDetails((pre) => ({
          ...initialTransaction,
          date: pre.date,
          paidTo: pre.paidTo,
          sender: pre.sender,
        }));

        setIsLoading(false);
        fetchParties();
      } else {
        await axios.put(
          "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/transaction/",
          {
            ...transactionDetails,
            amount: Number(transactionDetails.amount),
            receiverCommissionPercentage: Number(
              transactionDetails.receiverCommissionPercentage
            ),
            senderCommissionPercentage: Number(
              transactionDetails.senderCommissionPercentage
            ),
            id: transactionTransporter._id,
          },
          config
        );

        fetchSearch();

        setTransactionTransporter((pre) => ({
          ...initialTransaction,
          date: pre.date,
          paidTo: pre.paidTo,
          sender: pre.sender,
        }));

        setTransactionDetails((pre) => ({
          ...initialTransaction,
          date: pre.date,
          paidTo: pre.paidTo,
          sender: pre.sender,
        }));

        setIsFormFilled(false);
        setIsEditMode(false);
        setIsLoading(false);
        fetchParties();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <Dashboard>
      <div className="relative">
        <button
          onClick={() => setHideForm((a) => !a)}
          className="flex px-3 py-1 rounded-md fixed top-1 left-0 z-50 text-white items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 32 32"
          >
            <path
              fill="currentColor"
              d="M12 4H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 8H6V6h6zm14-8h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 8h-6V6h6zm-14 6H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2m0 8H6v-6h6zm14-8h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2m0 8h-6v-6h6z"
            ></path>
          </svg>
        </button>
        <div className="relative mx-auto flex items-start rounded bg-white p-2 text-sm">
          <form
            onSubmit={handleSubmit}
            className={`grid shrink-0 overflow-hidden ${hideForm ? "w-0" : "w-max border-r-2 border-black pr-2 mr-2"}`}
          >
            <div
              className={`grid grid-cols-3 gap-2 content-center whitespace-nowrap ${isFormFilled && !isEditMode ? "pointer-events-none" : "pointer-events-auto"}`}
            >
              <div className=" col-span-2">
                {isFormFilled && (
                  <span className="rounded grid bg-white">
                    Voucher Number:{" "}
                    <span className="p-1 bg-yellow-200 font-bold text-center shadow-inner border border-amber-300">
                      {transactionDetails.voucherNumber}
                    </span>
                  </span>
                )}
              </div>
              <label htmlFor="date" className="grid">
                Date
                <input
                  required
                  className="border border-gray-400 p-1"
                  type="date"
                  name="date"
                  id="date"
                  value={
                    isFormFilled
                      ? transactionTransporter?.date.split("T")[0]
                      : transactionDetails.date
                  }
                  onChange={(e) => {
                    setTransactionDetails({
                      ...transactionDetails,
                      date: e.target.value,
                    });
                  }}
                />
              </label>
              <div className="grid grid-cols-3 border-b-2 pb-2 border-blue-600 col-span-3 gap-2">
                <div className="grid">
                  <label htmlFor="payTo">Paid By</label>
                  <Select
                    value={transactionDetails.paidTo}
                    showSearch
                    optionFilterProp="label"
                    placeholder="Select a party"
                    onChange={(e) => {
                      setTransactionDetails((pre) => ({
                        ...pre,
                        paidTo: e,
                      }));
                    }}
                    options={[...parties]
                      ?.sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase())
                          return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                          return 1;
                        return 0;
                      })
                      .map((item) => ({
                        label: item.name,
                        value: item._id,
                        disabled:
                          transactionDetails.sender == item._id ? true : false,
                      }))}
                    style={{
                      border: "1px solid #555",
                      borderRadius: "2px",
                      height: "100%",
                      width: "9rem",
                    }}
                  ></Select>
                </div>
                <InputBox
                  label="Amount"
                  type="number"
                  value={transactionDetails.amount}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      amount: e.target.value,
                    })
                  }
                />
                <InputBox
                  type="number"
                  className="w-36"
                  // label="Receiver Commission % "
                  label="Charges by"
                  value={transactionDetails.receiverCommissionPercentage}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      receiverCommissionPercentage: e.target.value,
                    })
                  }
                />
                <div className="grid ">
                  {/* <label htmlFor="rComission">Receiver Commission</label> */}
                  <label htmlFor="rComission">Total Charges</label>
                  <input
                    required
                    disabled
                    className={`mt-1 h-fit w-36 border border-gray-400 p-1 pointer-events-none bg-gray-200`}
                    type="number"
                    name="rComission"
                    value={Number(
                      transactionDetails.receiverCommission
                    ).toFixed(2)}
                    tabIndex={-1}
                  />
                </div>
                <InputBox
                  type="number"
                  className=""
                  // label="Net Amount "
                  label="Net Debit"
                  value={Number(transactionDetails.netPaidAmount).toFixed(2)}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      netPaidAmount: e.target.value,
                    })
                  }
                />
                <div className="grid">
                  {/* <label htmlFor="">Commission Type</label> */}
                  <label htmlFor="">Charges Type</label>
                  <select
                    className="mt-1 h-fit w-36 border border-gray-400 px-1 py-1"
                    name="comisionTypeP"
                    id=""
                    tabIndex={isFormFilled && !isEditMode ? "-1" : "0"}
                    required
                    onSelect={(e) => {
                      setTransactionDetails((pre) => ({
                        ...pre,
                        comisionTypeP: e.target.value,
                      }));
                    }}
                  >
                    <option
                      selected={
                        isFormFilled &&
                        transactionDetails.comisionTypeP == "Credit"
                      }
                      value="Credit"
                    >
                      Credit
                    </option>
                    <option
                      selected={
                        isFormFilled &&
                        transactionDetails.comisionTypeP == "Debit"
                      }
                      value="Debit"
                    >
                      Debit
                    </option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 border-b-2 pb-2 border-blue-600 col-span-3 gap-2">
                <div className="grid">
                  <label htmlFor="">Received By</label>

                  <Select
                    value={transactionDetails.sender}
                    showSearch
                    optionFilterProp="label"
                    placeholder="Select a party"
                    onChange={(e) => {
                      setTransactionDetails((pre) => ({
                        ...pre,
                        sender: e,
                      }));
                    }}
                    // filterOption={filterOption}
                    options={[...parties]
                      ?.sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase())
                          return -1;
                        if (a.name.toLowerCase() > b.name.toLowerCase())
                          return 1;
                        return 0;
                      })
                      .map((item) => ({
                        label: item.name,
                        value: item._id,
                        disabled:
                          transactionDetails.paidTo == item._id ? true : false,
                      }))}
                    style={{
                      border: "1px solid #555",
                      borderRadius: "2px",
                      height: "100%",
                      width: "9rem",
                    }}
                  ></Select>
                </div>

                <InputBox
                  label="Amount"
                  type="number"
                  className="w-36"
                  value={transactionDetails.amount}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      amount: e.target.value,
                    })
                  }
                />

                <InputBox
                  // label="Sender Commission %"
                  label="Charges By"
                  type="number"
                  className="w-28"
                  value={transactionDetails.senderCommissionPercentage}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      senderCommissionPercentage: e.target.value,
                    })
                  }
                />

                <InputBox
                  className="pointer-events-none bg-gray-200"
                  // label="Sender Commission"
                  label="Total Charges"
                  type="number"
                  value={Number(transactionDetails.senderCommission).toFixed(2)}
                />
                <InputBox
                  // label="Net Amount"
                  label="Net Credit"
                  type="number"
                  className="pointer-events-none  w-28 bg-gray-200"
                  value={Number(transactionDetails.netReceivedAmount).toFixed(
                    2
                  )}
                  onChange={() => {}}
                />
                <div className="grid">
                  {/* <label htmlFor="">Commission Type</label> */}
                  <label htmlFor="">Charges Type</label>
                  <select
                    required
                    className="mt-1 h-fit w-36 border border-gray-400 px-1 py-1"
                    name="comisionTypeS"
                    id=""
                    tabIndex={isFormFilled && !isEditMode ? "-1" : "0"}
                    onChange={(e) => {
                      setTransactionDetails((pre) => ({
                        ...pre,
                        comisionTypeS: e.target.value,
                      }));
                    }}
                  >
                    <option
                      selected={
                        isFormFilled &&
                        transactionDetails.comisionTypeS == "Debit"
                      }
                      value="Debit"
                    >
                      Debit
                    </option>
                    <option
                      selected={
                        isFormFilled &&
                        transactionDetails.comisionTypeS == "Credit"
                      }
                      value="Credit"
                    >
                      Credit
                    </option>
                  </select>
                </div>
              </div>
              <InputBox
                // label="Receiver Name"
                label="Receiver Name"
                type="Paid to"
                className="w-36"
                value={transactionDetails.receiverName}
                onChange={(e) =>
                  setTransactionDetails({
                    ...transactionDetails,
                    receiverName: e.target.value,
                  })
                }
              />
              <InputBox
                label="Bilty Number"
                type="text"
                className="w-36"
                value={transactionDetails.biltyNumber}
                onChange={(e) =>
                  setTransactionDetails({
                    ...transactionDetails,
                    biltyNumber: e.target.value,
                  })
                }
              />

              <div className="grid ">
                <label htmlFor="phnumber">Phone Number</label>
                <input
                  required
                  className={` mt-1 h-fit w-36 border border-gray-400 p-1`}
                  type="number"
                  name="phnumber"
                  value={transactionDetails.receiverNumber}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      receiverNumber: e.target.value,
                    })
                  }
                  tabIndex={isFormFilled && !isEditMode ? "-1" : "0"}
                />
              </div>
              <div className="grid ">
                <label htmlFor="city">City</label>
                <input
                  required
                  className={`mt-1 h-fit w-36 border border-gray-400 p-1`}
                  type="text"
                  name="city"
                  value={transactionDetails.city}
                  onChange={(e) =>
                    setTransactionDetails({
                      ...transactionDetails,
                      city: e.target.value,
                    })
                  }
                  tabIndex={isFormFilled && !isEditMode ? "-1" : "0"}
                />
              </div>

              <div className="grid ">
                <label htmlFor="paid-name-no">Paid By Name / No.</label>
                <input
                  required
                  className={` mt-1 h-fit w-36 border border-gray-400 p-1`}
                  type="text"
                  name="paid-name-no"
                  value={
                    transactionDetails.senderNumber === 1
                      ? transactionDetails.receivedBy
                      : transactionDetails.senderNumber
                  }
                  onChange={(e) => setPaidByState(e.target.value)}
                  tabIndex={isFormFilled && !isEditMode ? "-1" : "0"}
                />
              </div>
              <InputBox
                name="netComision"
                // label="Net Commission"
                label="Net Charges"
                type="number"
                className="pointer-events-none bg-gray-200"
                value={Number(transactionDetails.netComision).toFixed(2)}
              />
            </div>
            <div className="my-4 gap-3 col-span-full flex font-medium border-t-2 border-blue-600 pt-2">
              <button
                className={`px-5 py-2 flex-1 flex items-center justify-center text-center rounded text-white bg-yellow-600 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                disabled={isLoading ? true : false}
                type="submit"
              >
                {isLoading ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.4em"
                    height="1.4em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                      opacity=".25"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
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
                ) : isEditMode && isFormFilled ? (
                  "Save Changes"
                ) : (
                  "Save"
                )}
              </button>

              {!isEditMode && isFormFilled ? (
                <button
                  className={`px-5 py-2 flex-1 flex items-center justify-center text-center rounded text-white bg-violet-600 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                  disabled={isLoading ? true : false}
                  type="button"
                  onClick={() => {
                    setIsEditMode(true);
                  }}
                >
                  Edit
                </button>
              ) : undefined}

              {!isEditMode && isFormFilled ? (
                <button
                  className={`px-5 py-2 flex-1 flex items-center justify-center text-center rounded text-white bg-red-600 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                  type="button"
                  onClick={() => {
                    handleDelete();
                  }}
                  disabled={isLoading ? true : false}
                >
                  {isLoading ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.4em"
                      height="1.4em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                        opacity=".25"
                      ></path>
                      <path
                        fill="currentColor"
                        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
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
                  ) : (
                    "Delete"
                  )}
                </button>
              ) : undefined}

              {isFormFilled && (
                <button
                  className="px-5 py-2 flex-1 flex items-center justify-center text-center rounded text-white bg-green-600"
                  type="button"
                  onClick={() => {
                    setIsFormFilled(false);
                    setIsEditMode(false);
                    setTransactionDetails({ ...initialTransaction });
                    setTransactionTransporter({ ...initialTransaction });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {/* <TransactionTable fetchSearch={fetchSearch} /> */}
          <TransactionTableGroupWrapper />
        </div>
      </div>
    </Dashboard>
  );
}

export default AddTransaction;
