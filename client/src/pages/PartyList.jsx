import { Select } from "antd";
import axios from "axios";
import "jspdf-autotable";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import { useParty } from "../context/Party";
import { searchDataContext } from "../context/SearchDataContext";

function PartyList() {
  const { parties } = useParty();
  const tableHead = ["Sr. No.", "Party", "City", "Credit", "Debit"];
  const [total, setTotal] = useState({ credit: 0, debit: 0, difference: 0 });
  const [data, setData] = useState({ comissions: [], total: 0 });

  const { config } = useContext(searchDataContext);

  const [filteredData, setFilteredData] = useState([]);
  const [selectedParties, setSelectedParties] = useState([]);

  useEffect(() => {
    if (selectedParties.length) {
      const newData = parties.filter((party) =>
        selectedParties.includes(party._id)
      );
      setFilteredData(newData);
    } else {
      setFilteredData(parties);
    }
  }, [parties, selectedParties]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(
        "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/admin/comission",
        config
      );
      setData(data);
    };

    getData();
  }, []);

  useEffect(() => {
    let debit = 0;
    let credit = 0;
    parties.map((party) => {
      if (party.currentBalance < 0) {
        debit += party.currentBalance;
      } else {
        credit -= party.currentBalance;
      }
    });

    credit = credit < 0 ? credit * -1 : credit;
    debit = debit < 0 ? debit * -1 : debit;

    const difference = debit - credit;

    setTotal({
      debit,
      credit,
      difference,
    });
  }, [parties]);

  return (
    <Dashboard>
      <div className="relative ">
        <div className="mx-auto my-5 grid w-[98%] bg-white p-4">
          <div className="flex justify-between items-center">
            <Link
              to="/add-party"
              className="h-fit w-fit rounded bg-[#707CD2] px-4 py-1 text-white "
            >
              <span className="text-2xl font-bold">+</span> Add New Party
            </Link>
            <div className="flex items-center pb-4 gap-10">
              Search:
              <Select
                optionFilterProp="label"
                mode="multiple"
                className="multi-select-antd"
                allowClear
                style={{ width: "100%", flex: 1, minWidth: "20rem" }}
                placeholder="Please select"
                onChange={setSelectedParties}
                value={selectedParties}
                options={parties?.map((item) => ({
                  value: item._id,
                  label: item.name,
                }))}
              />
            </div>
          </div>
          <table className="border border-black relative mt-4 text-center">
            <thead className="bg-violet-200 flex overflow-y-scroll relative">
              <tr className="flex w-full ">
                {tableHead.map((item, idx) => (
                  <td
                    key={idx}
                    className="border-b border-r flex-1 border-black px-2 py-2"
                  >
                    {item}
                  </td>
                ))}
              </tr>
            </thead>
            <div className="h-[calc(100vh-260px)] overflow-y-scroll grid">
              <tbody className="pb-8">
                {[...filteredData]
                  .sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                  })
                  .map((item, idx) => (
                    <tr className="flex w-full even:bg-gray-100" key={idx}>
                      <td className="w-1/2 border-b border-r border-black px-2 py-1">
                        {idx + 1}
                      </td>
                      <td className="w-1/2 border-b border-r border-black px-2 py-1capitalize ">
                        {item.name}
                      </td>
                      {/* <td className="border-b border-black px-2 py-1w-1/2 ">{item.wallet}</td> */}
                      <td className="w-1/2 border-b border-r border-black px-2 py-1capitalize ">
                        {item.city}
                      </td>
                      {item.currentBalance < 0 ? (
                        <>
                          <td
                            className={`w-1/2 border-b border-black border-r px-2 font-medium py-1`}
                          >
                            0
                          </td>
                          <td
                            className={`w-1/2 border-b border-black border-r px-2 font-medium py-1 text-red-600`}
                          >
                            {(item.currentBalance * -1).toFixed(2) + " DR"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            className={`w-1/2 border-b border-black border-r px-2 font-medium py-1 text-green-600`}
                          >
                            {item.currentBalance.toFixed(2) + " CR"}
                          </td>
                          <td
                            className={`w-1/2 border-b border-black border-r px-2 font-medium py-1`}
                          >
                            0
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
              </tbody>
              <div className="absolute bottom-0 border-t bg-amber-100 border-t-black left-0 w-full flex overflow-y-scroll">
                <div className="w-1/2 border-black border-r px-2 font-medium py-1">
                  {data?.total.toFixed(2)}
                </div>
                <div
                  className={`w-1/2 border-black border-r px-2 font-medium py-1 ${total.difference < 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {total.difference.toFixed(2)}
                </div>
                <div className="w-1/2 border-black border-r px-2 font-medium py-1">
                  total:{" "}
                </div>
                <div className="w-1/2 border-black border-r px-2 font-medium py-1 text-green-600">
                  {total.credit.toFixed(2)}
                </div>
                <div className="w-1/2 border-black border-r px-2 font-medium py-1 text-red-600">
                  {total.debit.toFixed(2)}
                </div>
              </div>
            </div>
          </table>
        </div>
      </div>
    </Dashboard>
  );
}

export default PartyList;
