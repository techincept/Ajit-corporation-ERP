import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import PartyProvider from "./context/Party";
import SearchDataContextProvider from "./context/SearchDataContext";
import TransactionProvider from "./context/Transaction.JSx";
import UserContextProvider from "./context/UserContext";
import AddParty from "./pages/AddParty";
import AddTransaction from "./pages/AddTransaction";
import BalanceReport from "./pages/BalanceReport";
import Cashbook from "./pages/Cashbook";
import DailyTransaction from "./pages/DailyTransaction";
import DashboardPage from "./pages/DashboardPage";
import LedgerReport from "./pages/LedgerReport";
import PartyCommissionReport from "./pages/PartyCommissionReport";
import PartyList from "./pages/PartyList";
import TransactionReport from "./pages/TransactionReport";
import User from "./pages/User";

function App() {
  return (
    <UserContextProvider>
      <PartyProvider>
        <TransactionProvider>
          <SearchDataContextProvider>
            <Routes>
              <Route path="/login" index element={<Login />} />
              <Route path="" element={<DashboardPage />} />
              <Route path="/create-transaction" element={<AddTransaction />} />
              <Route path="/daily-transaction" element={<DailyTransaction />} />
              <Route path="/user" element={<User />} />
              <Route path="/add-party" element={<AddParty />} />
              <Route path="/party-list" element={<PartyList />} />
              <Route path="/balance-report" element={<BalanceReport />} />
              <Route
                path="/transaction-report"
                element={<TransactionReport />}
              />
              <Route path="/cashbook" element={<Cashbook />} />
              <Route path="/ledger-report" element={<LedgerReport />} />
              <Route
                path="/commission-ledger-report"
                element={<LedgerReport />}
              />
              <Route
                path="/party-commission-report"
                element={<PartyCommissionReport />}
              />
            </Routes>
          </SearchDataContextProvider>
        </TransactionProvider>
      </PartyProvider>
    </UserContextProvider>
  );
}

export default App;
