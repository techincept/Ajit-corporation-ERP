import { Select } from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import InputBox from "../components/InputBox";
import { searchDataContext } from "../context/SearchDataContext";
function LedgerReport() {
  const [data, setData] = useState({ comissions: [], total: "Nil" });
  const [runningCommission, setRunningCommission] = useState([]);

  const { config } = useContext(searchDataContext);

  const [filteredData, setFilteredData] = useState([]);
  const [selectedFromParties, setSelectedFromParties] = useState([]);
  const [selectedToParties, setSelectedToParties] = useState([]);

  const [selectOptions, setSelectOptions] = useState({
    from: [],
    to: [],
  });

  useEffect(() => {
    if (selectedFromParties.length && selectedToParties.length) {
      const commissions = data.comissions.filter(
        ({ transaction }) =>
          selectedFromParties.includes(transaction.paidTo._id) ||
          selectedToParties.includes(transaction.sender._id)
      );

      setFilteredData(commissions);
    } else if (selectedFromParties.length) {
      const commissions = data.comissions.filter(({ transaction }) =>
        selectedFromParties.includes(transaction.paidTo._id)
      );

      setFilteredData(commissions);
    } else if (selectedToParties.length) {
      const commissions = data.comissions.filter(({ transaction }) =>
        selectedToParties.includes(transaction.sender._id)
      );

      setFilteredData(commissions);
    } else {
      setFilteredData(data.comissions);
    }
  }, [data, selectedFromParties, selectedToParties]);

  useEffect(() => {
    const fromSet = [];
    const toSet = [];

    const fromData = [];
    const toData = [];

    data?.comissions.forEach((item) => {
      const toId = item.transaction.sender._id;
      const fromId = item.transaction.paidTo._id;
      const fromName = item.transaction.paidTo.name;
      const toName = item.transaction.sender.name;

      if (!fromSet.includes(fromId)) {
        fromData.push({
          value: fromId,
          label: fromName,
        });
        fromSet.push(fromId);
      }

      if (!toSet.includes(toId)) {
        toData.push({
          value: toId,
          label: toName,
        });
        toSet.push(toId);
      }
    });

    setSelectOptions({
      from: fromData,
      to: toData,
    });
  }, [data]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(
        "https://ajitserver.checkmatecreatives.com/api/ajit-corporation/v1/admin/comission",
        config
      );
      setData(data);

      const running = [data?.comissions[0].amount];
      for (let i = 1; i < data?.comissions.length; i++) {
        running.push(running[i - 1] + data?.comissions[i].amount);
      }
      setRunningCommission(running);
    };

    getData();
  }, [config]);

  return (
    <Dashboard>
      <div className="relative">
        <div className="mx-auto grid w-[98%] bg-white p-4">
          <div className="flex items-end gap-3">
            <InputBox
              className="w-48 border-gray-500 py-1 uppercase text-gray-500"
              label="From Date"
              name="fromDate"
              type="date"
            />
            <InputBox
              className="w-48 border-gray-500 py-1 uppercase text-gray-500"
              label="To Date"
              name="toDate"
              type="date"
            />
            <button className="h-fit rounded bg-green-500 px-3 py-1.5 text-white hover:bg-green-400 ">
              Search
            </button>

            <div className="flex items-end ml-auto gap-10">
              <div className="flex items-center gap-4 justify-end">
                from:
                <Select
                  optionFilterProp="label"
                  mode="multiple"
                  className="multi-select-antd"
                  allowClear
                  style={{ minWidth: "20rem" }}
                  placeholder="Please select"
                  onChange={setSelectedFromParties}
                  value={selectedFromParties}
                  options={selectOptions.from}
                />
              </div>
              <div className="flex items-center gap-4 justify-end">
                to:
                <Select
                  optionFilterProp="label"
                  mode="multiple"
                  className="multi-select-antd"
                  allowClear
                  style={{ minWidth: "20rem" }}
                  placeholder="Please select"
                  onChange={setSelectedToParties}
                  value={selectedToParties}
                  options={selectOptions.to}
                />
              </div>
            </div>
          </div>
          <table className="border border-black relative mt-4">
            <thead className="bg-violet-200 flex font-semibold overflow-y-scroll">
              <tr className="grid w-full grid-cols-6 border-b border-black">
                <td className="text-center border-r border-black">Date</td>
                <td className="text-center border-r border-black">
                  Voucher No.
                </td>
                <td className="text-center border-r border-black">From</td>
                <td className="text-center border-r border-black">To</td>
                <td className="text-center border-r border-black">
                  Net Comission
                </td>
                <td className="text-center ">Running Comission</td>
              </tr>
            </thead>

            <div className="h-[calc(100vh-220px)] overflow-y-scroll grid">
              <tbody className="h-[400px]">
                {filteredData.map((comm, idx) => (
                  <TableRow
                    key={comm._id}
                    voucherNo={comm?.transaction?.voucherNumber}
                    from={comm?.transaction?.paidTo?.name}
                    to={comm?.transaction?.sender?.name}
                    date={comm?.transaction?.date?.split("T")[0]}
                    netComission={comm?.amount}
                    amount={runningCommission[idx].toFixed(2)}
                  />
                ))}
              </tbody>
            </div>
            <tfoot className="bg-amber-200 grid grid-cols-5 text-center overflow-y-scroll">
              <td className="col-span-3 border-r border-black"></td>
              <td className="col-start-4">Total Net Comission: </td>
              <td>{Number(data?.total).toFixed(2)}</td>
            </tfoot>
          </table>
        </div>
      </div>
    </Dashboard>
  );
}

export default LedgerReport;

const TableRow = ({ voucherNo, from, to, date, netComission, amount }) => (
  <tr className="grid w-full grid-cols-6 border-b border-black">
    <td className="text-center border-r border-black">{date}</td>
    <td className="text-center border-r border-black">{voucherNo}</td>
    <td className="text-center border-r border-black">{from}</td>
    <td className="text-center border-r border-black">{to}</td>
    <td className="text-center border-r border-black">
      {netComission.toFixed(2)}
    </td>
    <td className="text-center">{amount}</td>
  </tr>
);
