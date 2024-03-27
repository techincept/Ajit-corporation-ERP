import { useState } from "react";
import Dashboard from "../components/Dashboard";
import InputBox from "../components/InputBox";
import PartyTable from "../components/PartyTable";
import { useParty } from "../context/Party";
import { useTransaction } from "../context/Transaction.JSx";

function AddParty() {
  const { party, setParty, createParty, updateParty, isLoading, setIsLoading } =
    useParty();
  const { isEditMode, setIsEditMode } = useTransaction();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateParty();
      setIsEditMode(false);
    } else {
      createParty();
    }
  };

  const [formVisible, setFormVisible] = useState(true);

  return (
    <Dashboard>
      <div className="relative h-[calc(100vh-100px)] overflow-hidden">
        <button
          onClick={() => {
            setFormVisible((a) => !a);
          }}
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
        <div className="mx-auto mt-5 flex w-full bg-white p-10 ">
          {formVisible && (
            <div className=" border-r-2 border-blue-500 pr-5 mr-4">
              <form className="grid mb-5 w-72" onSubmit={handleSubmit}>
                <div className="grid gap-5">
                  <InputBox
                    required
                    className="w-full"
                    name="partyName"
                    label="Party Name"
                    value={party.name}
                    onChange={(e) =>
                      setParty({ ...party, name: e.target.value })
                    }
                  />
                  <InputBox
                    required
                    className="w-full"
                    name="city"
                    label="City"
                    value={party.city}
                    onChange={(e) =>
                      setParty({ ...party, city: e.target.value })
                    }
                  />
                  <InputBox
                    required
                    className="w-full"
                    type="number"
                    name="openingBalance"
                    label="Opening Balance"
                    value={party.openingBalance}
                    onChange={(e) =>
                      setParty({ ...party, openingBalance: e.target.value })
                    }
                  />
                  <label htmlFor="type" className="grid gap-2">
                    Type:
                    <select
                      name="type"
                      id="type"
                      onChange={(e) =>
                        setParty({ ...party, type: e.target.value })
                      }
                      required
                      defaultValue={party.party}
                      className="border border-slate-400 py-2"
                    >
                      <option
                        value="credit"
                        selected={party.type == "credit" ? true : false}
                      >
                        Credit
                      </option>
                      <option
                        value="debit"
                        selected={party.type == "debit" ? true : false}
                      >
                        Debit
                      </option>
                    </select>
                  </label>
                </div>
                <button
                  type="submit"
                  onClick={() => setIsLoading(true)}
                  className="mt-4 h-fit w-full rounded bg-green-500 px-5 py-2 font-bold text-white hover:bg-green-400 flex items-center justify-center"
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
                  ) : isEditMode ? (
                    "Save Changes"
                  ) : (
                    "Save"
                  )}
                </button>
              </form>
            </div>
          )}
          <PartyTable party={party} setParty={setParty} />
        </div>
      </div>
    </Dashboard>
  );
}

export default AddParty;
